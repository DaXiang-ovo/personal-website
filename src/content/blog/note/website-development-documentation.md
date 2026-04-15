---
title: 个人网站开发文档
link: website-development-documentation
catalog: true
date: 2026-04-15 00:00:00
tags:
  - 开发文档
  - Astro
  - 指南
  - 个人网站
categories:
  - 笔记
description: 个人网站的完整开发文档，包含技术栈介绍、项目结构说明、页面编辑指南、功能增减方法以及部署说明。
---

## 概述

这是一个基于 [Astro](https://astro.build) 构建的现代化个人网站，集成了博客、工具箱、友链等多种功能。网站采用静态生成(SSG)架构，支持国际化(i18n)、响应式设计、SEO优化等特性。

### 核心特性
- **静态站点生成**: 高性能，SEO友好
- **多语言支持**: 中文、英文、日文（可配置）
- **工具箱功能**: Minecraft追踪器、陈奕迅音乐播放器、游戏战绩展示等
- **现代化技术栈**: TypeScript + React + Tailwind CSS
- **内容管理**: Markdown + YAML配置
- **部署灵活**: 支持Vercel、Netlify、GitHub Pages等

## 技术栈

### 核心框架
- **Astro v5.16.6**: 静态站点生成器
- **React v19.2.1**: 交互式UI组件
- **TypeScript v5.9.3**: 类型安全

### 样式与UI
- **Tailwind CSS v4.1.17**: 实用优先的CSS框架
- **Radix UI**: 无头UI组件
- **Astro Icon**: 图标系统

### 构建工具
- **Vite v7.3.1**: 构建工具
- **pnpm v10.33.0**: 包管理
- **Biome**: 代码格式化与linting

### 内容处理
- **Remark/Rehype**: Markdown处理流水线
- **Mermaid**: 图表渲染
- **KaTeX**: 数学公式

### 部署目标
- **Vercel**: 主要部署平台（配置在 `astro.config.mjs`）
- **GitHub Pages**: 备用方案（配置在 `.github/workflows/deploy.yml`）

## 项目结构

```
personal-website/
├── config/                    # 站点配置文件
│   └── site.yaml             # 主配置文件（所有站点设置）
├── src/
│   ├── assets/               # 静态资源
│   │   ├── lqips.json        # 低质量图片占位符
│   │   ├── similarities.json # 文章相似度数据
│   │   └── summaries.json    # 文章摘要数据
│   ├── components/           # 组件目录
│   │   ├── announcement/     # 公告系统
│   │   ├── bangumi/          # 追番页面组件
│   │   ├── category/         # 分类组件
│   │   ├── christmas/        # 圣诞主题特效
│   │   ├── comment/          # 评论系统组件
│   │   ├── layout/           # 布局组件
│   │   ├── post/             # 文章相关组件
│   │   ├── tools/            # 工具箱组件
│   │   │   ├── WoTStats.tsx  # 坦克世界战绩
│   │   │   └── MusicPlayer.tsx # 音乐播放器
│   │   ├── ui/               # UI基础组件
│   │   └── ...
│   ├── content/              # 内容目录
│   │   └── blog/             # 博客文章
│   │       ├── life/         # 随笔分类
│   │       ├── note/         # 笔记分类
│   │       └── ...
│   ├── data/                 # 静态数据
│   │   ├── music.json        # 音乐播放器数据
│   │   └── wot-config.json   # 坦克世界配置
│   ├── layouts/              # 页面布局
│   ├── lib/                  # 工具函数库
│   │   ├── content/          # 内容处理工具
│   │   ├── markdown/         # Markdown扩展
│   │   ├── seo/              # SEO工具
│   │   └── ...
│   ├── pages/                # 页面路由
│   │   ├── [lang]/           # 国际化路由（可选的）
│   │   ├── tools/            # 工具页面
│   │   ├── categories/       # 分类页面
│   │   ├── tags/             # 标签页面
│   │   └── ...
│   ├── scripts/              # 构建脚本
│   ├── store/                # 状态管理
│   ├── styles/               # 全局样式
│   └── types/                # TypeScript类型定义
├── public/                   # 公共静态资源
│   ├── img/                  # 图片资源
│   ├── music/                # 音乐文件
│   └── ...
├── .github/workflows/        # GitHub Actions
│   └── deploy.yml            # 部署到GitHub Pages
├── astro.config.mjs          # Astro配置文件
├── tailwind.config.mjs       # Tailwind配置
├── tsconfig.json             # TypeScript配置
├── biome.json                # Biome格式化配置
└── package.json              # 依赖包配置
```

## 开发环境设置

### 前置要求
- Node.js 18+
- pnpm 8+

### 安装步骤
1. 克隆项目
   ```bash
   git clone <repository-url>
   cd personal-website
   ```

2. 安装依赖
   ```bash
   pnpm install
   ```

3. 启动开发服务器
   ```bash
   pnpm dev
   ```
   开发服务器默认运行在 `http://localhost:4321`

4. 构建生产版本
   ```bash
   pnpm build
   ```

5. 预览构建结果
   ```bash
   pnpm preview
   ```

### 常用命令
```bash
# 开发
pnpm dev              # 启动开发服务器
pnpm build            # 构建生产版本
pnpm preview          # 本地预览构建结果

# 代码质量
pnpm check            # TypeScript类型检查
pnpm lint             # 代码检查
pnpm lint:fix         # 自动修复代码问题
pnpm format           # 代码格式化

# 内容处理
pnpm generate:all     # 生成LQIP、摘要、相似度数据
pnpm generate:lqips   # 生成低质量图片占位符
pnpm generate:summaries # 生成文章摘要
pnpm generate:similarities # 生成文章相似度

# 部署
pnpm docker:up        # 启动Docker容器
pnpm docker:down      # 停止Docker容器
```

## 页面编辑指南

### 1. 配置文件 (`config/site.yaml`)

所有站点配置都在 `config/site.yaml` 中，修改后需要重启开发服务器。

#### 基本站点信息
```yaml
site:
  title: "网站标题"
  subtitle: "网站副标题"
  description: "网站描述"
  url: "https://your-domain.com"
  avatar: "/img/avatar.webp"
```

#### 导航菜单配置
```yaml
navigation:
  - name: "首页"
    path: "/"
    icon: "ri:home-heart-fill"
  - name: "工具"
    path: "/tools"
    icon: "ri:tools-fill"
  - name: "文章"
    icon: "ri:quill-pen-ai-fill"
    children:
      - name: "分类"
        path: "/categories"
```

#### 社交链接
```yaml
social:
  github:
    url: "https://github.com/your-username"
    icon: "ri:github-fill"
    color: "#191717"
  email:
    url: "mailto:your-email@example.com"
    icon: "ri:mail-line"
```

#### 工具箱配置
工具箱页面自动读取 `src/pages/tools/index.astro` 中的配置。添加新工具：

1. 在 `src/pages/tools/index.astro` 的 `tools` 数组中添加新项
2. 创建对应的页面文件 `src/pages/tools/<工具名称>.astro`
3. 添加工具图标到 `public/img/tools/` 目录

### 2. 博客文章管理

#### 创建新文章
1. 在 `src/content/blog/` 下创建对应分类的目录
2. 新建Markdown文件，使用以下frontmatter格式：

```markdown
---
title: "文章标题"
link: "url-friendly-slug"  # 必须与文件名不同
date: "2026-04-15 00:00:00"
tags:
  - "标签1"
  - "标签2"
categories:
  - "分类名称"  # 必须与config/site.yaml中的categoryMap对应
description: "文章摘要"
---

文章内容使用Markdown语法...
```

#### 文章分类系统
分类系统支持层级结构：
- 一级分类：随笔、笔记、工具、周刊
- 二级分类：前端、后端、算法等

配置分类映射：
```yaml
categoryMap:
  随笔: life
  笔记: note
  前端: front-end
```

#### 特色功能
- **加密内容块**: 使用 `:::encrypted{password="密码"}` 语法
- **数学公式**: 使用 `$公式$` 或 `$$公式$$` 语法
- **图表**: 使用Mermaid语法
- **代码块增强**: 支持标题、标记行、命令显示

### 3. 工具箱页面开发

#### 现有工具
1. **Minecraft Tracker** (`/tools/minecraft`)
2. **陈奕迅音乐播放器** (`/tools/music`)
3. **三角洲行动战绩** (`/tools/deltaforce`)
4. **火影忍者手游** (`/tools/naruto`)
5. **坦克世界欧服** (`/tools/wot`)

#### 添加新工具
1. **创建工具页面**:
   ```bash
   src/pages/tools/new-tool.astro
   ```

2. **添加工具卡片**:
   编辑 `src/pages/tools/index.astro`，在 `tools` 数组中添加：
   ```javascript
   {
     title: '工具名称',
     href: '/tools/new-tool',
     desc: '工具描述',
     color: '#HEX颜色',
     iconType: 'custom'
   }
   ```

3. **添加图标**:
   - 将图标放入 `public/img/tools/` 目录
   - 在 `src/pages/tools/index.astro` 中添加图标渲染逻辑

#### 工具组件开发
工具通常使用React组件实现：
- 组件位置：`src/components/tools/`
- 示例参考：`WoTStats.tsx`、`MusicPlayer.tsx`
- 数据文件：`src/data/` 目录下的JSON文件

### 4. 国际化(i18n)

网站支持多语言，配置文件在 `config/site.yaml` 的 `i18n` 部分。

#### 启用多语言
```yaml
i18n:
  defaultLocale: zh
  locales:
    - code: zh
      label: 中文
    - code: en
      label: English
      enabled: true  # 设为true启用
```

#### 翻译文件
- 位置：`src/i18n/locales/`
- 格式：JSON文件，按语言代码命名（如 `zh.json`、`en.json`）

#### 页面路由
- 单语言：`/about`
- 多语言：`/zh/about`、`/en/about`

## 功能增减指南

### 添加新页面
1. **创建页面文件**:
   - 普通页面：`src/pages/page-name.astro`
   - 带布局页面：使用现有布局组件

2. **添加到导航**:
   编辑 `config/site.yaml` 的 `navigation` 部分

3. **配置SEO**:
   在页面frontmatter中添加 `title` 和 `description`

### 添加新组件
1. **Astro组件**:
   - 位置：`src/components/` 相关目录
   - 命名：`ComponentName.astro`

2. **React组件**:
   - 位置：`src/components/` 相关目录
   - 命名：`ComponentName.tsx`
   - 需要在 `astro.config.mjs` 中已配置React集成

### 修改样式
1. **Tailwind类**: 直接在组件中使用
2. **全局样式**: `src/styles/global/`
3. **组件样式**: `src/styles/components/`

### 启用/禁用功能
所有功能开关在 `config/site.yaml` 中：

#### 评论系统
```yaml
comment:
  provider: "giscus"  # giscus | remark42 | waline | twikoo | none
  giscus:
    repo: "username/repo"
    # ... 其他配置
```

#### 分析统计
```yaml
analytics:
  umami:
    enabled: true
    id: "your-umami-id"
    endpoint: "https://your-umami.domain"
```

#### 圣诞特效
```yaml
christmas:
  enabled: true
  features:
    snowfall: true
    christmasHat: true
```

#### 背景音乐
```yaml
bgm:
  enabled: true
```

## 部署指南

### 1. Vercel部署（推荐）

网站已配置为Vercel部署，关联GitHub仓库后自动部署。

#### 环境变量
- 不需要特殊环境变量
- 构建命令：`pnpm build`
- 输出目录：`dist`

#### 自定义域名
1. 在Vercel项目设置中添加自定义域名
2. 更新 `config/site.yaml` 中的 `site.url`
3. 重新部署

### 2. GitHub Pages部署

已配置GitHub Actions工作流 (`.github/workflows/deploy.yml`)。

#### 手动部署步骤
1. 推送代码到main分支
2. Actions自动构建并部署到gh-pages分支
3. 在GitHub仓库设置中启用GitHub Pages

#### 自定义域名
1. 在仓库设置中添加Custom Domain
2. 更新 `config/site.yaml` 中的 `site.url`
3. 重新触发部署

### 3. Docker部署

项目包含Docker配置，适用于本地测试或自有服务器。

#### 启动Docker
```bash
pnpm docker:up
```

#### 停止Docker
```bash
pnpm docker:down
```

#### 查看日志
```bash
pnpm docker:logs
```

### 4. 构建优化

#### 分析构建大小
```bash
ANALYZE=true pnpm build
```
打开 `dist/__sonda__/report.html` 查看分析报告

#### 图片优化
- 使用WebP格式
- 自动生成LQIP（低质量图片占位符）
- 响应式图片：`srcset` 自动生成

## 故障排除

### 常见问题

#### 1. 开发服务器无法启动
- **端口占用**: 默认使用4321端口，占用时自动尝试其他端口
- **依赖问题**: 运行 `pnpm install` 重新安装依赖
- **TypeScript错误**: 运行 `pnpm check` 检查类型错误

#### 2. 构建失败
- **内存不足**: Node.js内存限制，尝试 `NODE_OPTIONS="--max-old-space-size=4096"`
- **语法错误**: 运行 `pnpm lint` 检查代码问题
- **配置错误**: 检查 `config/site.yaml` 语法

#### 3. 页面显示异常
- **缓存问题**: 清理浏览器缓存，重启开发服务器
- **组件错误**: 检查浏览器开发者工具控制台
- **样式问题**: 检查Tailwind类名是否正确

#### 4. 内容不更新
- **缓存问题**: 运行 `pnpm generate:all` 重新生成内容数据
- **构建缓存**: 删除 `node_modules/.vite` 和 `dist` 目录重新构建

### 调试技巧

#### 开发工具
- **Astro Dev Toolbar**: 浏览器中按 `Ctrl+Shift+P` 打开
- **React DevTools**: 安装浏览器扩展
- **TypeScript**: 编辑器集成类型检查

#### 日志查看
- **构建日志**: `pnpm build` 输出
- **服务器日志**: 开发服务器控制台输出
- **浏览器控制台**: F12打开开发者工具

## 维护与更新

### 定期任务

#### 1. 依赖更新
```bash
pnpm update
pnpm audit
```

#### 2. 内容维护
- 定期运行 `pnpm generate:all` 更新内容数据
- 清理未使用的图片资源
- 更新 `config/site.yaml` 中的过期链接

#### 3. 备份策略
- 代码：Git版本控制
- 内容：`src/content/` 目录
- 配置：`config/` 目录
- 媒体文件：`public/` 目录

### 性能优化

#### 1. 图片优化
- 使用WebP格式
- 合理尺寸，避免过大图片
- 使用LQIP占位符

#### 2. 代码分割
- Astro自动代码分割
- React组件懒加载：`client:load`、`client:idle`、`client:visible`
- 按需加载第三方库

#### 3. 缓存策略
- 静态资源长期缓存
- CDN加速配置
- Service Worker（如需）

## 扩展开发

### 自定义Markdown扩展

#### 添加新语法
1. 创建remark/rehype插件：`src/lib/markdown/`
2. 在 `astro.config.mjs` 中注册插件
3. 更新 `config/site.yaml` 中的内容配置

#### 示例：加密块插件
```typescript
// src/lib/markdown/remark-encrypted-directive.ts
export function remarkEncryptedDirective() {
  // 插件实现
}
```

### 添加API路由

#### 创建API端点
1. 创建文件：`src/pages/api/endpoint.ts`
2. 导出处理函数
3. 访问路径：`/api/endpoint`

#### 示例：简单的API
```typescript
export async function GET({ request }) {
  return new Response(
    JSON.stringify({ message: "Hello World" }),
    { headers: { "Content-Type": "application/json" } }
  )
}
```

### 集成第三方服务

#### 添加新评论系统
1. 创建组件：`src/components/comment/providers/NewProvider.tsx`
2. 配置支持：更新 `config/site.yaml` 的comment配置
3. 集成到评论组件

#### 添加分析工具
1. 创建组件：`src/components/analytics/NewAnalytics.astro`
2. 配置集成：更新 `astro.config.mjs`
3. 配置开关：更新 `config/site.yaml`

## 资源链接

### 官方文档
- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### 项目相关
- [GitHub Repository](https://github.com/DaXiang-ovo/personal-website)
- [Vercel Deployment](https://daxiang.vercel.app)
- [主题原作者](https://blog.cosine.ren)

### 工具资源
- [Iconify图标库](https://icon-sets.iconify.design)
- [Mermaid图表语法](https://mermaid.js.org)
- [KaTeX数学公式](https://katex.org)

---

*本文档最后更新：2026-04-15*  
*保持更新以反映项目的最新状态*