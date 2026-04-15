import { useState, useEffect, useCallback } from 'react';

const CACHE_KEY = 'mojang_cache';
const TIMEOUT_MS = 10_000;

interface MojangVersionInfo {
  javaLatestRelease: string;
  javaLatestSnapshot: string;
  bedrockLatestRelease: string;
  releaseDate: string;
  cachedAt: number;
}

function getCached(): MojangVersionInfo | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

async function fetchMojangVersions(): Promise<MojangVersionInfo> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch('https://launchermeta.mojang.com/mc/game/version_manifest.json', { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const manifest = await res.json();
    const javaLatestRelease = manifest.latest.release;
    const javaLatestSnapshot = manifest.latest.snapshot;
    const releaseEntry = manifest.versions.find((v: any) => v.id === javaLatestRelease && v.type === 'release');
    const result: MojangVersionInfo = {
      javaLatestRelease,
      javaLatestSnapshot,
      bedrockLatestRelease: 'N/A',
      releaseDate: releaseEntry ? releaseEntry.releaseTime.split('T')[0] : '',
      cachedAt: Date.now(),
    };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(result));
    return result;
  } catch (err) {
    clearTimeout(timer);
    const cached = getCached();
    if (cached) return cached;
    throw err;
  }
}

function wikiUrl(version: string) {
  return `https://zh.minecraft.wiki/w/${encodeURIComponent(`Java版${version}`)}`;
}

function snapshotWikiUrl(version: string) {
  return `https://zh.minecraft.wiki/w/${encodeURIComponent(version)}`;
}

export default function MinecraftTracker() {
  const [data, setData] = useState<MojangVersionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMojangVersions();
      setFromCache(Date.now() - result.cachedAt > 60_000);
      setData(result);
    } catch (e: any) {
      setError(e?.message ?? '请求失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const isSnapshot = data ? data.javaLatestSnapshot !== data.javaLatestRelease : false;

  return (
    <div className="mc-page min-h-[80vh] font-mono relative">
      <div className="mc-bg" />
      <div className="max-w-2xl mx-auto px-4 pb-16 relative z-10 pt-8">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#5A8A3A] border-[3px] border-[#7EC850] flex items-center justify-center mx-auto mb-3 shadow-[4px_4px_0_#3A5A1A]">
            <img src="/img/tools/minecraft.png" alt="Minecraft" className="w-12 h-12 rounded" />
          </div>
          <h1 className="text-3xl text-[#7EC850] font-bold tracking-wider" style={{ textShadow: '2px 2px 0 #3A5A1A' }}>
            Minecraft 版本追踪
          </h1>
          <p className="text-xs text-[#5A8A3A] tracking-[3px] uppercase mt-1">Java Edition · Bedrock Edition</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="w-60 h-6 bg-[#3D2B1A] border-2 border-[#6B4A2A] overflow-hidden">
              <div className="h-full w-[60%] animate-[dirt-slide_1.2s_linear_infinite]" style={{ background: 'repeating-linear-gradient(90deg, #8B5E3C 0px, #8B5E3C 20px, #6B4A2A 20px, #6B4A2A 24px)' }} />
            </div>
            <p className="text-[#666] text-xs">正在从 Mojang 服务器加载版本数据...</p>
          </div>
        )}

        {/* Error without data */}
        {!loading && error && !data && (
          <div className="text-center py-16">
            <div className="mc-card border-red-600 p-6 mb-4">
              <p className="text-[#FF4444] text-sm">⚠ 加载失败：{error}</p>
            </div>
            <button onClick={load} className="mc-btn mt-4">重试</button>
          </div>
        )}

        {/* Data */}
        {!loading && data && (
          <>
            {/* Cache banner */}
            {(fromCache || error) && (
              <div className="mc-card border-yellow-600 bg-yellow-900/20 p-3 mb-6 flex items-center gap-2">
                <span>⚠</span>
                <span className="text-[#FFD700] text-xs">
                  数据来自缓存，更新于 {new Date(data.cachedAt).toLocaleString('zh-CN')}
                </span>
              </div>
            )}

            {/* Java Latest Release */}
            <div className="mc-card p-6 mb-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="mc-label">☕ Java 版 · 最新正式版</div>
                  <div className="text-3xl text-[#7EC850] font-bold" style={{ textShadow: '1px 1px 0 #3A5A1A' }}>
                    {data.javaLatestRelease}
                  </div>
                  <div className="text-[#666] text-xs mt-1">发布日期：{data.releaseDate || '—'}</div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <a href={wikiUrl(data.javaLatestRelease)} target="_blank" rel="noopener noreferrer" className="mc-wiki-btn">
                    📖 查看 Wiki
                  </a>
                  <a href={`https://www.minecraft.net/zh-hans/article/minecraft-java-edition-${data.javaLatestRelease.replace(/\./g, '-')}`} target="_blank" rel="noopener noreferrer" className="mc-wiki-btn mc-wiki-btn-secondary">
                    📰 官方公告
                  </a>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#3A5A2A]">
                <div className="mc-label mb-2">更新亮点</div>
                <ul className="space-y-1">
                  <li className="text-[#A0A0A0] text-xs flex items-start gap-2">
                    <span className="text-green-400 shrink-0">▸</span>查看完整更新内容，请访问上方 Wiki 链接
                  </li>
                  <li className="text-[#A0A0A0] text-xs flex items-start gap-2">
                    <span className="text-green-400 shrink-0">▸</span>Wiki 包含新方块、新生物、新特性的详细说明
                  </li>
                </ul>
              </div>
            </div>

            {/* Snapshot */}
            {isSnapshot && (
              <div className="mc-card mc-card-snapshot p-6 mb-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="mc-label" style={{ color: '#FFD700' }}>🧪 Java 版 · 最新快照</div>
                    <div className="text-3xl font-bold" style={{ color: '#FFD700', textShadow: '1px 1px 0 #3A3A1A' }}>
                      {data.javaLatestSnapshot}
                    </div>
                    <div className="text-[#666] text-xs mt-1">预览版本，可能不稳定</div>
                  </div>
                  <a href={snapshotWikiUrl(data.javaLatestSnapshot)} target="_blank" rel="noopener noreferrer" className="mc-wiki-btn mc-wiki-btn-gold shrink-0">
                    📖 查看 Wiki
                  </a>
                </div>
              </div>
            )}

            {/* Bedrock */}
            <div className="mc-card p-6 mb-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="mc-label">📱 基岩版 · 最新发布</div>
                  <div className="text-3xl text-[#7EC850] font-bold" style={{ textShadow: '1px 1px 0 #3A5A1A' }}>
                    {data.bedrockLatestRelease}
                  </div>
                  <div className="text-[#666] text-xs mt-1">跨平台版本（手机/主机/Win10）</div>
                </div>
                <a href="https://zh.minecraft.wiki/w/基岩版" target="_blank" rel="noopener noreferrer" className="mc-wiki-btn shrink-0">
                  📖 基岩版 Wiki
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div className="mc-card p-5 mb-6">
              <div className="mc-label mb-3">🔗 快速链接</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { href: 'https://zh.minecraft.wiki', label: '中文 Wiki' },
                  { href: 'https://www.minecraft.net/zh-hans/download', label: '官方下载' },
                  { href: 'https://zh.minecraft.wiki/w/Java版版本历史', label: '版本历史' },
                  { href: 'https://zh.minecraft.wiki/w/基岩版版本历史', label: '基岩版历史' },
                  { href: 'https://feedback.minecraft.net', label: '反馈中心' },
                  { href: 'https://zh.minecraft.wiki/w/快照', label: '快照说明' },
                ].map(link => (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="mc-link-btn">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button onClick={load} className="mc-btn">🔄 刷新数据</button>
            </div>
          </>
        )}
      </div>

      <style>{`
        .mc-page { background: #1A1A1A; }
        .mc-bg { position: fixed; inset: 0; background-image: radial-gradient(circle, #2a4a2a 1px, transparent 1px); background-size: 24px 24px; pointer-events: none; z-index: 0; }
        .mc-card { background: #2A2A2A; border: 2px solid #5A8A3A; box-shadow: inset 0 0 0 1px #3A5A2A, 4px 4px 0 #1A1A1A; }
        .mc-card-snapshot { border-color: #8A7A1A; box-shadow: inset 0 0 0 1px #6A5A0A, 4px 4px 0 #1A1A1A; }
        .mc-label { font-size: 11px; color: #7EC850; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px; }
        .mc-wiki-btn { display: inline-flex; align-items: center; gap: 4px; padding: 6px 14px; background: #3A5A2A; border: 2px solid #5A8A3A; color: #7EC850; font-size: 13px; text-decoration: none; transition: background 0.15s; white-space: nowrap; }
        .mc-wiki-btn:hover { background: #5A8A3A; color: #fff; }
        .mc-wiki-btn-secondary { background: #2A3A2A; border-color: #4A6A3A; color: #5A8A3A; }
        .mc-wiki-btn-secondary:hover { background: #3A5A2A; color: #7EC850; }
        .mc-wiki-btn-gold { background: #3A3A1A; border-color: #8A7A1A; color: #FFD700; }
        .mc-wiki-btn-gold:hover { background: #5A5A1A; }
        .mc-link-btn { display: block; padding: 8px 10px; background: #222; border: 1px solid #3A5A2A; color: #7EC850; font-size: 12px; text-align: center; text-decoration: none; transition: background 0.15s; }
        .mc-link-btn:hover { background: #2a4a2a; }
        .mc-btn { font-family: 'Courier New', monospace; background: #5A8A3A; color: #fff; border: 2px solid #7EC850; padding: 8px 24px; cursor: pointer; font-size: 14px; transition: background 0.15s; box-shadow: 3px 3px 0 #3A5A1A; }
        .mc-btn:hover { background: #7EC850; color: #1A1A1A; }
        @keyframes dirt-slide { from { transform: translateX(-100%); } to { transform: translateX(200%); } }
      `}</style>
    </div>
  );
}
