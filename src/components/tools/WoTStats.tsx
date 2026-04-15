import { useState, useCallback } from 'react';
import wotConfig from '../../data/wot-config.json';

const APP_ID = wotConfig.applicationId;
const BASE_URL = 'https://api.worldoftanks.eu/wot';
const TIMEOUT_MS = 10_000;

interface VehicleStat {
  tank_id: number; name: string; battles: number; wins: number;
  damage_dealt: number; frags: number; spotted: number;
  winRate: number; avgDamage: number; wn8: number;
}

interface PlayerStats {
  account_id: number; nickname: string; battles: number; wins: number;
  damage_dealt: number; frags: number; winRate: number; avgDamage: number;
  avgFrags: number; avgSpotted: number; avgXp: number; survived: number;
  survivalRate: number; hitRate: number; wn8: number; vehicles: VehicleStat[];
}

// WN8 formula
function calcWn8(stats: { battles: number; wins: number; damage_dealt: number; frags: number; spotted: number; dropped_capture_points: number }, exp: { expDamage: number; expSpot: number; expFrag: number; expDef: number; expWinRate: number }) {
  if (stats.battles <= 0) return 0;
  const rD = (stats.damage_dealt / stats.battles) / exp.expDamage;
  const rS = (stats.spotted / stats.battles) / exp.expSpot;
  const rF = (stats.frags / stats.battles) / exp.expFrag;
  const rDf = (stats.dropped_capture_points / stats.battles) / exp.expDef;
  const rW = (stats.wins / stats.battles) / exp.expWinRate;
  const rWc = Math.max(0, (rW - 0.71) / 0.29);
  const rDc = Math.max(0, (rD - 0.22) / 0.78);
  const rFc = Math.max(0, Math.min(rDc + 0.2, (rF - 0.12) / 0.88));
  const rSc = Math.max(0, Math.min(rDc + 0.1, (rS - 0.38) / 0.62));
  const rDfc = Math.max(0, Math.min(rDc + 0.1, (rDf - 0.10) / 0.90));
  return Math.max(0, 980 * rDc + 210 * rDc * rFc + 155 * rFc * rSc + 75 * rDfc * rFc + 145 * Math.min(1.8, rWc));
}

async function fetchTimeout(url: string) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), TIMEOUT_MS);
  try { const r = await fetch(url, { signal: c.signal }); clearTimeout(t); return r; }
  catch (e) { clearTimeout(t); throw e; }
}

function wn8Color(wn8: number) {
  if (wn8 >= 2450) return '#A020F0';
  if (wn8 >= 2000) return '#6040BF';
  if (wn8 >= 1600) return '#3972C6';
  if (wn8 >= 1200) return '#4099BF';
  if (wn8 >= 900) return '#4EAD4E';
  if (wn8 >= 650) return '#849B24';
  if (wn8 >= 450) return '#CC7A00';
  return '#CD3333';
}

function wn8Label(wn8: number) {
  if (wn8 >= 2450) return 'Super Unicum';
  if (wn8 >= 2000) return 'Unicum';
  if (wn8 >= 1600) return 'Great';
  if (wn8 >= 1200) return 'Very Good';
  if (wn8 >= 900) return 'Good';
  if (wn8 >= 650) return 'Above Average';
  if (wn8 >= 450) return 'Average';
  return 'Below Average';
}

export default function WoTStats() {
  const [username, setUsername] = useState(wotConfig.defaultPlayer);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'overview' | 'vehicles'>('overview');

  const search = useCallback(async (name?: string) => {
    const searchName = name ?? username;
    if (!searchName.trim()) return;
    setLoading(true); setError(null);
    try {
      // Step 1: search
      let res = await fetchTimeout(`${BASE_URL}/account/list/?application_id=${APP_ID}&search=${encodeURIComponent(searchName)}&limit=1`);
      const searchData = await res.json();
      if (!searchData.data?.length) throw new Error(`玩家 "${searchName}" 未找到`);
      const { account_id, nickname } = searchData.data[0];

      // Step 2: account info
      res = await fetchTimeout(`${BASE_URL}/account/info/?application_id=${APP_ID}&account_id=${account_id}`);
      const infoData = await res.json();
      const info = infoData.data?.[account_id];
      if (!info) throw new Error('账号数据不可用');
      const all = info.statistics?.all ?? {};
      const { battles = 0, wins = 0, damage_dealt = 0, frags = 0, spotted = 0, xp = 0, survived_battles = 0, hits = 0, shots = 0 } = all;

      // Step 3: vehicle stats
      res = await fetchTimeout(`${BASE_URL}/tanks/stats/?application_id=${APP_ID}&account_id=${account_id}&fields=tank_id,all`);
      const tanksData = await res.json();
      const tankList: any[] = tanksData.data?.[account_id] ?? [];
      const activeTanks = tankList.filter(t => t.all?.battles > 0);

      // Fetch vehicle names
      const nameMap = new Map<number, string>();
      const tankIds = activeTanks.map(t => t.tank_id);
      for (let i = 0; i < tankIds.length; i += 100) {
        try {
          const ids = tankIds.slice(i, i + 100).join(',');
          const r = await fetchTimeout(`${BASE_URL}/encyclopedia/vehicles/?application_id=${APP_ID}&tank_id=${ids}&fields=tank_id,short_name,name`);
          const j = await r.json();
          if (j.data) Object.entries(j.data).forEach(([id, v]: any) => { if (v?.short_name || v?.name) nameMap.set(Number(id), v.short_name || v.name); });
        } catch {}
      }

      // Fetch WN8 expected values
      let expMap = new Map<number, any>();
      try {
        const r = await fetchTimeout('https://static.modxvm.com/wn8-data-exp/json/wn8exp.json');
        const d = await r.json();
        d.data?.forEach((e: any) => expMap.set(e.IDNum, e));
      } catch {}

      // Build vehicle stats
      const vehicles: VehicleStat[] = activeTanks.map(t => {
        const s = t.all;
        const exp = expMap.get(t.tank_id);
        const wn8 = exp ? calcWn8({ battles: s.battles, wins: s.wins, damage_dealt: s.damage_dealt, frags: s.frags, spotted: s.spotted, dropped_capture_points: s.dropped_capture_points }, exp) : 0;
        return {
          tank_id: t.tank_id, name: nameMap.get(t.tank_id) ?? `#${t.tank_id}`,
          battles: s.battles, wins: s.wins, damage_dealt: s.damage_dealt, frags: s.frags, spotted: s.spotted,
          winRate: s.battles > 0 ? s.wins / s.battles : 0, avgDamage: s.battles > 0 ? Math.round(s.damage_dealt / s.battles) : 0, wn8,
        };
      }).sort((a, b) => b.battles - a.battles).slice(0, 20);

      // Overall WN8
      let overallWn8 = 0;
      if (vehicles.length > 0) {
        let tw = 0, tb = 0;
        vehicles.forEach(v => { if (v.wn8 > 0) { tw += v.wn8 * v.battles; tb += v.battles; } });
        overallWn8 = tb > 0 ? tw / tb : 0;
      }

      setPlayerStats({
        account_id, nickname, battles, wins, damage_dealt, frags,
        winRate: battles > 0 ? wins / battles : 0,
        avgDamage: battles > 0 ? Math.round(damage_dealt / battles) : 0,
        avgFrags: battles > 0 ? frags / battles : 0,
        avgSpotted: battles > 0 ? spotted / battles : 0,
        avgXp: battles > 0 ? Math.round(xp / battles) : 0,
        survived: survived_battles,
        survivalRate: battles > 0 ? survived_battles / battles : 0,
        hitRate: shots > 0 ? hits / shots : 0,
        wn8: overallWn8, vehicles,
      });
    } catch (e: any) {
      setError(e?.message ?? '查询失败');
    } finally {
      setLoading(false);
    }
  }, [username]);

  const pct = (v: number) => (v * 100).toFixed(1) + '%';

  return (
    <div className="min-h-[80vh] font-sans" style={{ background: '#1a1a2e' }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-center mb-4">
          <img src="/img/tools/wot.png" alt="坦克世界" className="w-16 h-16" />
        </div>
        <h1 className="text-center text-2xl font-bold text-amber-400 mb-2">坦克世界 · 欧服战绩</h1>
        <p className="text-center text-xs text-amber-400/50 mb-8">World of Tanks EU Server</p>

        {/* Search */}
        <div className="flex gap-2 mb-8">
          <input
            type="text" value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="输入玩家昵称..."
            className="flex-1 px-4 py-2.5 bg-white/5 border border-amber-400/30 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
          />
          <button onClick={() => search()} disabled={loading} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors disabled:opacity-50">
            {loading ? '查询中...' : '查询'}
          </button>
        </div>

        {error && <div className="text-center text-red-400 text-sm mb-4 p-3 bg-red-400/10 rounded-lg">{error}</div>}

        {playerStats && (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white">{playerStats.nickname}</h2>
              <div className="flex items-center justify-center gap-3 mt-2">
                <div className="text-3xl font-bold" style={{ color: wn8Color(playerStats.wn8) }}>
                  {Math.round(playerStats.wn8)}
                </div>
                <div className="text-left">
                  <div className="text-xs text-white/50">WN8</div>
                  <div className="text-sm font-semibold" style={{ color: wn8Color(playerStats.wn8) }}>{wn8Label(playerStats.wn8)}</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 justify-center">
              <button onClick={() => setTab('overview')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${tab === 'overview' ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/60 hover:text-white'}`}>总览</button>
              <button onClick={() => setTab('vehicles')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${tab === 'vehicles' ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/60 hover:text-white'}`}>车辆 Top 20</button>
            </div>

            {tab === 'overview' && (
              <div>
                <div className="text-center text-xs text-amber-400/50 mb-2">基于全部数据</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: '总场次', value: playerStats.battles.toLocaleString() },
                  { label: '胜率', value: pct(playerStats.winRate) },
                  { label: '场均伤害', value: playerStats.avgDamage.toLocaleString() },
                  { label: '场均击杀', value: playerStats.avgFrags.toFixed(2) },
                  { label: '场均侦察', value: playerStats.avgSpotted.toFixed(2) },
                  { label: '场均经验', value: playerStats.avgXp.toLocaleString() },
                  { label: '存活率', value: pct(playerStats.survivalRate) },
                  { label: '命中率', value: pct(playerStats.hitRate) },
                ].map(s => (
                  <div key={s.label} className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-1">{s.label}</div>
                    <div className="text-lg font-bold text-white">{s.value}</div>
                  </div>
                ))}
              </div>
              </div>
            )}

            {tab === 'vehicles' && (
              <div className="overflow-x-auto">
                <div className="text-center text-xs text-amber-400/50 mb-2">基于全部数据</div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-white/40 text-xs uppercase border-b border-white/10">
                      <th className="py-2 px-2">车辆</th>
                      <th className="py-2 px-2 text-right">场次</th>
                      <th className="py-2 px-2 text-right">胜率</th>
                      <th className="py-2 px-2 text-right">场均伤害</th>
                      <th className="py-2 px-2 text-right">WN8</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerStats.vehicles.map(v => (
                      <tr key={v.tank_id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-2 px-2 text-white">{v.name}</td>
                        <td className="py-2 px-2 text-right text-white/60">{v.battles}</td>
                        <td className="py-2 px-2 text-right text-white/60">{pct(v.winRate)}</td>
                        <td className="py-2 px-2 text-right text-white/60">{v.avgDamage}</td>
                        <td className="py-2 px-2 text-right font-bold" style={{ color: wn8Color(v.wn8) }}>{Math.round(v.wn8)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {!playerStats && !loading && !error && (
          <div className="text-center text-white/30 py-16">
            <div className="text-5xl mb-4">🎯</div>
            <p>输入玩家昵称开始查询</p>
            <p className="text-xs mt-1">默认查询：{wotConfig.defaultPlayer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
