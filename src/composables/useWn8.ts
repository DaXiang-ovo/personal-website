const WN8_EXP_CACHE_KEY = 'wn8_exp'
const TIMEOUT_MS = 10_000

export interface VehicleRawStats {
  battles: number
  wins: number
  damage_dealt: number
  frags: number
  spotted: number
  dropped_capture_points: number
}

export interface ExpectedValues {
  expDamage: number
  expSpot: number
  expFrag: number
  expDef: number
  expWinRate: number // as fraction 0-1
}

export interface Wn8ExpData {
  data: Array<{
    IDNum: number
    expDamage: number
    expSpot: number
    expFrag: number
    expDef: number
    expWinRate: number
  }>
}

/**
 * Standard WN8 formula
 * https://wiki.wargaming.net/en/Player_Ratings_(WoT)#WN8
 */
export function calculateWn8(stats: VehicleRawStats, expected: ExpectedValues): number {
  if (stats.battles <= 0) return 0

  const avgDamage = stats.damage_dealt / stats.battles
  const avgSpot = stats.spotted / stats.battles
  const avgFrag = stats.frags / stats.battles
  const avgDef = stats.dropped_capture_points / stats.battles
  const winRate = stats.wins / stats.battles

  const rDAMAGE = avgDamage / expected.expDamage
  const rSPOT = avgSpot / expected.expSpot
  const rFRAG = avgFrag / expected.expFrag
  const rDEF = avgDef / expected.expDef
  const rWIN = winRate / expected.expWinRate

  // Normalization
  const rWINc = Math.max(0, (rWIN - 0.71) / (1 - 0.71))
  const rDAMAGEc = Math.max(0, (rDAMAGE - 0.22) / (1 - 0.22))
  const rFRAGc = Math.max(0, Math.min(rDAMAGEc + 0.2, (rFRAG - 0.12) / (1 - 0.12)))
  const rSPOTc = Math.max(0, Math.min(rDAMAGEc + 0.1, (rSPOT - 0.38) / (1 - 0.38)))
  const rDEFc = Math.max(0, Math.min(rDAMAGEc + 0.1, (rDEF - 0.10) / (1 - 0.10)))

  const wn8 =
    980 * rDAMAGEc +
    210 * rDAMAGEc * rFRAGc +
    155 * rFRAGc * rSPOTc +
    75 * rDEFc * rFRAGc +
    145 * Math.min(1.8, rWINc)

  return Math.max(0, wn8)
}

async function fetchExpectedValues(): Promise<Wn8ExpData> {
  const cached = sessionStorage.getItem(WN8_EXP_CACHE_KEY)
  if (cached) {
    try {
      return JSON.parse(cached) as Wn8ExpData
    } catch {
      // ignore
    }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(
      'https://static.modxvm.com/wn8-data-exp/json/wn8exp.json',
      { signal: controller.signal }
    )
    clearTimeout(timer)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data: Wn8ExpData = await res.json()
    sessionStorage.setItem(WN8_EXP_CACHE_KEY, JSON.stringify(data))
    return data
  } catch (err) {
    clearTimeout(timer)
    throw err
  }
}

export function useWn8() {
  return { calculateWn8, fetchExpectedValues }
}
