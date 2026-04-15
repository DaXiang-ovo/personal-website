import narutoData from '../../data/naruto-mobile.json';

const data = narutoData;
const pct = (v: number) => (v * 100).toFixed(1) + '%';
const formatDate = (iso: string) => iso.split('T')[0];
const barWidth = (value: number, max: number) => Math.min(100, (value / max) * 100).toFixed(1) + '%';

export default function NarutoMobileStats() {
  return (
    <div className="min-h-[80vh] relative overflow-hidden" style={{ background: '#0D1B2A' }}>
      {/* Watermark */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black pointer-events-none select-none z-0" style={{ color: 'rgba(255,107,0,0.03)' }} aria-hidden="true">忍</div>

      <div className="max-w-3xl mx-auto px-4 pb-12 pt-8 relative z-10">
        <div className="flex justify-center mb-4">
          <img src="/img/tools/naruto.png" alt="火影忍者" className="w-16 h-16 rounded-lg" />
        </div>
        <h1 className="text-center mb-2 text-2xl font-bold tracking-widest" style={{ color: '#FF6B00', textShadow: '0 0 12px rgba(255,107,0,0.5)' }}>
          火影忍者手游 · 战绩
        </h1>
        <p className="text-center mb-8 text-xs" style={{ color: 'rgba(255,107,0,0.6)' }}>
          数据更新于 {formatDate(data.lastUpdated)}
        </p>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: '胜率', value: pct(data.stats.winRate) },
            { label: '总场次', value: String(data.stats.totalBattles) },
            { label: '战力', value: data.stats.combatPower.toLocaleString(), small: true },
            { label: '段位', value: data.stats.rankTier, small: true },
          ].map(s => (
            <div key={s.label} className="scroll-card p-4 text-center">
              <div className="stat-label">{s.label}</div>
              <div className={`stat-value ${s.small ? 'text-base' : ''}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Chakra bars */}
        <div className="scroll-card p-5 mb-6">
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#FFD700' }}>查克拉指标</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: '#A0A8B0' }}>
                <span>胜率</span><span>{pct(data.stats.winRate)}</span>
              </div>
              <div className="chakra-bar-bg">
                <div className="chakra-bar-fill" style={{ width: barWidth(data.stats.winRate, 1) }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: '#A0A8B0' }}>
                <span>战力</span><span>{data.stats.combatPower.toLocaleString()}</span>
              </div>
              <div className="chakra-bar-bg">
                <div className="chakra-bar-fill" style={{ width: barWidth(data.stats.combatPower, 1000000) }} />
              </div>
            </div>
          </div>
        </div>

        {/* Main characters */}
        <div className="scroll-card p-5 mb-6">
          <h2 className="text-sm font-semibold mb-3" style={{ color: '#FFD700' }}>主用角色</h2>
          <div className="flex flex-wrap gap-2">
            {data.stats.mainCharacters.map((char: string) => (
              <span key={char} className="char-tag">{char}</span>
            ))}
          </div>
        </div>

        {/* Locked */}
        <div className="locked-card p-5 flex items-start gap-4">
          <div className="text-2xl mt-1">🔒</div>
          <div>
            <h2 className="text-sm mb-1 font-semibold" style={{ color: '#555' }}>动态查询（待探索）</h2>
            <p className="text-xs" style={{ color: '#444' }}>暂无稳定官方 API，动态查询功能开发中</p>
          </div>
        </div>
      </div>

      <style>{`
        .scroll-card { background: rgba(13,27,42,0.8); border: 2px solid #FFD700; border-radius: 4px; box-shadow: 0 0 8px rgba(255,215,0,0.2); }
        .stat-label { font-size: 11px; color: rgba(255,215,0,0.6); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .stat-value { font-size: 1.5rem; font-weight: bold; color: #FF6B00; }
        .chakra-bar-bg { height: 8px; background: rgba(255,107,0,0.15); border-radius: 4px; overflow: hidden; }
        .chakra-bar-fill { height: 100%; background: linear-gradient(90deg, #FF6B00, #FFD700); border-radius: 4px; transition: width 0.6s ease; }
        .char-tag { background: rgba(255,107,0,0.15); border: 1px solid #FF6B00; color: #FF8C38; padding: 4px 12px; border-radius: 20px; font-size: 13px; }
        .locked-card { background: rgba(13,27,42,0.5); border: 1px dashed #2A3F55; border-radius: 4px; opacity: 0.7; }
      `}</style>
    </div>
  );
}
