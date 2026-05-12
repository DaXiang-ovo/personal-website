---
title: DataEase 报表嵌入个人网站流程分享与踩坑记录
catalog: true
date: 2026-05-12 00:00:00
tags:
  - DataEase
  - 嵌入式
  - JWT
  - Astro
  - 踩坑记录
categories:
  - 笔记
description: 将 DataEase v2.10.19 仪表板通过 DIV 嵌入方式集成到个人 Astro 网站的全过程，包含 SDK 加载、JWT 认证、跨域配置等关键环节的踩坑与解决方案。
---

## 背景

我个人网站的数据看板（DataVision）需要嵌入 DataEase 仪表板，但 DataEase v2.10.19 的嵌入式文档与实际 API 之间存在较大差距。本文记录了从零到成功嵌入的完整过程。

## 环境信息

- DataEase v2.10.19，Docker 部署，APISIX 网关（端口 9080）
- 前端: Astro 5 + 自定义主题
- 服务器: 阿里云 ECS

## 嵌入式应用配置

在 DataEase 管理后台创建嵌入式应用时，有两个关键选择:

1. **应用类型必须选"单点登录"**，不是"API Key"。这决定了后续认证方式使用 JWT + APP Secret 签名。
2. **域名白名单**填写嵌入方的实际域名和开发域名，用逗号分隔。

## 服务器跨域配置

需要在 DataEase 容器的配置文件 `/opt/apps/config/application.yml` 中添加 CORS 白名单:

```yaml
embedded:
  origin-list: http://localhost:4321,https://daxiang.vercel.app
```

修改后执行 `docker restart dataease` 重启容器。这个配置通过 APISIX 网关返回 `Access-Control-Allow-Origin` 响应头。

## SDK 加载：三次试错

这是整个过程中踩坑最多的环节。

### 第一次: div_import.js — 失败

官方文档引导使用 `div_import_0.0.0-dataease.js`，但我发现它会创建一个新的 `<head>` 元素插入 DOM，导致浏览器不执行其中的 ES module 脚本。页面没有任何报错，`window.DataEaseBi` 始终为 `undefined`，停留在"SDK 加载超时"。

### 第二次: 动态 import() — 失败

改用 `import('http://server/js/panel-0.0.0-dataease.js')` 动态加载后，模块加载成功，`DataEaseBi` 类也能访问。但 SDK 内部构造 API URL 时抛出 `Failed to execute 'open' on 'XMLHttpRequest': Invalid URL`。原因是 SDK 的 ConfigGlobal 组件无法正确拼接 API 路径。

### 第三次: 原生 `<script type="module">` — 成功

最终方案简单到让人意外：

```html
<script type="module" crossorigin
  src="http://120.26.31.230:9080/js/panel-0.0.0-dataease.js">
</script>
```

直接通过浏览器标准的模块脚本标签加载，SDK 内部的路由解析正常工作。

## JWT Token 生成的坑

DataEase v2.10 使用 JWT + HS256 做嵌入式认证。客户端需自行生成 JWT Token。

### Payload 的 account 字段

这是最隐蔽的坑。测试了以下 payload 格式：

| Payload | 结果 |
|---------|------|
| `{uid:1, oid:1, appId:"xxx", exp:...}` | ❌ 用户不存在或被禁用 |
| `{userId:1, orgId:1, ...}` | ❌ 用户不存在或被禁用 |
| `{uid:1, oid:1, appId:"xxx", account:"admin", exp:...}` | ✅ 通过 |

`account` 字段必须是一个在 DataEase 中实际存在的用户账号。文档未提及此字段，但 APISIX forward-auth 插件验证 JWT 时会查询该账号。

### 客户端签名（Web Crypto API）

使用浏览器原生 Web Crypto API，无需引入任何第三方 JWT 库：

```javascript
async function generateToken(appId, appSecret, payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = b64url(JSON.stringify(header));
  const payloadB64 = b64url(JSON.stringify(payload));
  const data = headerB64 + '.' + payloadB64;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(appSecret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const sigBytes = new Uint8Array(sig);
  let sigChars = '';
  for (let i = 0; i < sigBytes.length; i++) sigChars += String.fromCharCode(sigBytes[i]);
  return data + '.' + b64url(sigChars);
}
```

注意 `b64url` 是 Base64URL 编码（替换 `+` → `-`，`/` → `_`，去掉 `=`），不是标准 Base64。

### baseUrl 尾部斜杠

传给 `DataEaseBi` 构造函数的 `baseUrl` 必须以 `/` 结尾:

```javascript
// 正确
baseUrl: 'http://120.26.31.230:9080/'

// 错误 — SDK 内部的 URL 拼接会出错
baseUrl: 'http://120.26.31.230:9080'
```

## 初始化代码

```javascript
const bi = new window.DataEaseBi('Dashboard', {
  baseUrl: 'http://120.26.31.230:9080/',
  token: token,
  dvId: '1247187068585644032',
  busiFlag: 'dashboard'
});

await bi.initialize({ container: '#bi-container', lng: 'zh' });
```

## 在 Astro 中集成

Astro 项目中需要注意:
- SDK 脚本用 `<script type="module" crossorigin src="...">` 直接加载
- 业务逻辑用 `<script define:vars={{ ... }}>` 从服务端注入变量
- APP Secret 放在 `.env.local` 中，通过 `import.meta.env` 读取

## 总结

这次嵌入踩过的主要坑：
1. SDKB加载方式：div_import.js 和动态 import() 都不行，只有原生 script 标签可行
2. JWT payload 缺 `account` 字段导致认证失败
3. `baseUrl` 尾部斜杠缺失导致 XHR URL 构造错误
4. 服务器 CORS 需在 `application.yml` 手动配置并重启容器

如果你也在做 DataEase v2 的嵌入集成，希望这篇文章能帮你绕过这些坑。
