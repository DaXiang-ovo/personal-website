import deltaforceData from '../../data/deltaforce.json';

const data = deltaforceData;
const pct = (v: number) => (v * 100).toFixed(1) + '%';
const formatDate = (iso: string) => iso.split('T')[0];

export default function DeltaForceStats() {
  return (
    <div className="df-page min-h-[80vh] font-mono relative" style={{ background: '#0A0F0A' }}>
      <div className="camo-stripe" />

      <div className="max-w-3xl mx-auto px-4 pb-12 pt-8">
        <div className="flex justify-center mb-4">
          <img src="/img/tools/deltaforce.png" alt="三角洲行动" className="w-16 h-16 rounded-lg" />
        </div>
        <h1 className="text-center mb-2 text-2xl tracking-widest" style={{ color: '#00FF41', textShadow: '0 0 10px #00FF41' }}>
          三角洲行动 · 战绩
        </h1>
        <p className="text-center mb-8 text-xs" style={{ color: 'rgba(0,255,65,0.5)' }}>
          数据更新于 {formatDate(data.lastUpdated)}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'KDR', value: data.stats.kdr.toFixed(2) },
            { label: '胜率', value: pct(data.stats.winRate) },
            { label: '总场次', value: String(data.stats.totalMatches) },
            { label: '段位', value: data.stats.rankTier, small: true },
          ].map(s => (
            <div key={s.label} className="hud-box">
              <div className="hud-label">{s.label}</div>
              <div className={`hud-value ${s.small ? 'text-base' : ''}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Screenshots */}
        {data.screenshots && data.screenshots.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm mb-3" style={{ color: '#00FF41' }}>[ 截图记录 ]</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.screenshots.map((src: string, i: number) => (
                <img key={i} src={src} alt={`截图 ${i + 1}`} className="w-full rounded border border-[#00FF41]/30 object-cover" style={{ maxHeight: 200 }} />
              ))}
            </div>
          </div>
        )}

        {/* Locked */}
        <div className="locked-card p-5 flex items-start gap-4">
          <div className="text-2xl mt-1">🔒</div>
          <div>
            <h2 className="text-sm mb-1" style={{ color: '#888' }}>动态查询（待探索）</h2>
            <p className="text-xs" style={{ color: '#555' }}>暂无稳定官方 API，动态查询功能开发中</p>
          </div>
        </div>
      </div>

      <div className="camo-stripe" />

      <style>{`
        .camo-stripe { height: 8px; background: repeating-linear-gradient(90deg, #1A2A1A 0px, #1A2A1A 20px, #2A3A1A 20px, #2A3A1A 40px, #0A1A0A 40px, #0A1A0A 60px, #3A4A2A 60px, #3A4A2A 80px); }
        .hud-box { background: #0F1A0F; border: 1px solid #00FF41; padding: 16px 12px; text-align: center; box-shadow: 0 0 8px rgba(0,255,65,0.15), inset 0 0 8px rgba(0,255,65,0.05); }
        .hud-label { font-size: 11px; color: rgba(0,255,65,0.6); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
        .hud-value { font-size: 1.6rem; font-weight: bold; color: #00FF41; text-shadow: 0 0 8px #00FF41; }
        .locked-card { background: #0F1A0F; border: 1px dashed #333; border-radius: 4px; opacity: 0.7; }
      `}</style>
    </div>
  );
}
