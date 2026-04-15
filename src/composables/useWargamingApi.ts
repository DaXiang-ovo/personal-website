import { calculateWn8, useWn8, type VehicleRawStats } from './useWn8'
import wotConfig from '../data/wot-config.json'

const TIMEOUT_MS = 10_000
const APP_ID = wotConfig.applicationId
const BASE_URL = 'https://api.worldoftanks.eu/wot'

export interface VehicleStat {
  tank_id: number
  name: string
  battles: number
  wins: number
  damage_dealt: number
  frags: number
  spotted: number
  winRate: number
  avgDamage: number
  wn8: number
}

export interface WoTPlayerStats {
  account_id: number
  nickname: string
  battles: number
  wins: number
  damage_dealt: number
  frags: number
  winRate: number
  avgDamage: number
  avgFrags: number
  wn8: number
  vehicles: VehicleStat[]
  cachedAt: number
}

function cacheKey(username: string): string {
  return `wot_player_${username.toLowerCase()}`
}

function getCached(username: string): WoTPlayerStats | null {
  try {
    const raw = sessionStorage.getItem(cacheKey(username))
    if (raw) return JSON.parse(raw) as WoTPlayerStats
  } catch { /* ignore */ }
  return null
}

function setCache(username: string, data: WoTPlayerStats): void {
  try {
    sessionStorage.setItem(cacheKey(username), JSON.stringify(data))
  } catch { /* ignore */ }
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)
    return res
  } catch (err) {
    clearTimeout(timer)
    throw err
  }
}

// Fetch vehicle names from Wargaming encyclopedia
async function fetchVehicleNames(tankIds: number[]): Promise<Map<number, string>> {
  const nameMap = new Map<number, string>()
  if (tankIds.length === 0) return nameMap

  // Wargaming API allows up to 100 tank_ids per request
  const chunks: number[][] = []
  for (let i = 0; i < tankIds.length; i += 100) {
    chunks.push(tankIds.slice(i, i + 100))
  }

  for (const chunk of chunks) {
    try {
      const ids = chunk.join(',')
      const url = `${BASE_URL}/encyclopedia/vehicles/?application_id=${APP_ID}&tank_id=${ids}&fields=tank_id,name,short_name`
      const res = await fetchWithTimeout(url)
      if (!res.ok) continue
      const json = await res.json()
      if (json.data) {
        for (const [id, info] of Object.entries(json.data)) {
          if (info && typeof info === 'object' && 'short_name' in info) {
            nameMap.set(Number(id), (info as { short_name: string }).short_name)
          }
        }
      }
    } catch { /* ignore, fall back to tank_id */ }
  }
  return nameMap
}

export async function searchPlayer(username: string): Promise<WoTPlayerStats> {
  // Step 1: search account
  const searchUrl = `${BASE_URL}/account/list/?application_id=${APP_ID}&search=${encodeURIComponent(username)}&limit=1`
  let res = await fetchWithTimeout(searchUrl)
  if (!res.ok) {
    const cached = getCached(username)
    if (cached) return cached
    throw new Error(`HTTP ${res.status}`)
  }

  const searchData = await res.json()
  if (!searchData.data || searchData.data.length === 0) {
    throw { notFound: true, message: `玩家 "${username}" 未找到` }
  }

  const account_id: number = searchData.data[0].account_id
  const nickname: string = searchData.data[0].nickname

  // Step 2: account info
  const infoUrl = `${BASE_URL}/account/info/?application_id=${APP_ID}&account_id=${account_id}`
  res = await fetchWithTimeout(infoUrl)
  if (!res.ok) {
    const cached = getCached(username)
    if (cached) return cached
    throw new Error(`HTTP ${res.status}`)
  }

  const infoData = await res.json()
  const accountInfo = infoData.data?.[account_id]
  if (!accountInfo) {
    const cached = getCached(username)
    if (cached) return cached
    throw new Error('账号数据不可用')
  }

  const allStats = accountInfo.statistics?.all ?? {}
  const battles: number = allStats.battles ?? 0
  const wins: number = allStats.wins ?? 0
  const damage_dealt: number = allStats.damage_dealt ?? 0
  const frags: number = allStats.frags ?? 0

  // Step 3: vehicle stats
  const tanksUrl = `${BASE_URL}/account/tanks/?application_id=${APP_ID}&account_id=${account_id}&fields=tank_id,statistics`
  res = await fetchWithTimeout(tanksUrl)

  let vehicles: VehicleStat[] = []

  if (res.ok) {
    const tanksData = await res.json()
    const tankList: Array<{
      tank_id: number
      statistics: {
        battles: number
        wins: number
        damage_dealt: number
        frags: number
        spotted: number
        dropped_capture_points: number
      }
    }> = tanksData.data?.[account_id] ?? []

    const activeTanks = tankList.filter((t) => t.statistics.battles > 0)

    // Fetch vehicle names
    const tankIds = activeTanks.map((t) => t.tank_id)
    const nameMap = await fetchVehicleNames(tankIds)

    // Fetch WN8 expected values
    let expData: Awaited<ReturnType<typeof useWn8['fetchExpectedValues']>> | null = null
    try {
      expData = await useWn8().fetchExpectedValues()
    } catch { /* WN8 unavailable */ }

    const expMap = new Map<number, { expDamage: number; expSpot: number; expFrag: number; expDef: number; expWinRate: number }>()
    if (expData) {
      for (const entry of expData.data) {
        expMap.set(entry.IDNum, entry)
      }
    }

    vehicles = activeTanks
      .map((t) => {
        const s = t.statistics
        const b = s.battles
        const rawStats: VehicleRawStats = {
          battles: b,
          wins: s.wins,
          damage_dealt: s.damage_dealt,
          frags: s.frags,
          spotted: s.spotted,
          dropped_capture_points: s.dropped_capture_points,
        }
        const exp = expMap.get(t.tank_id)
        const wn8 = exp ? calculateWn8(rawStats, { ...exp }) : 0

        return {
          tank_id: t.tank_id,
          name: nameMap.get(t.tank_id) ?? `#${t.tank_id}`,
          battles: b,
          wins: s.wins,
          damage_dealt: s.damage_dealt,
          frags: s.frags,
          spotted: s.spotted,
          winRate: b > 0 ? s.wins / b : 0,
          avgDamage: b > 0 ? Math.round(s.damage_dealt / b) : 0,
          wn8,
        }
      })
      .sort((a, b) => b.battles - a.battles)
      .slice(0, 10)
  }

  // Overall WN8
  let overallWn8 = 0
  if (battles > 0) {
    const rawStats: VehicleRawStats = {
      battles,
      wins,
      damage_dealt,
      frags,
      spotted: allStats.spotted ?? 0,
      dropped_capture_points: allStats.dropped_capture_points ?? 0,
    }
    const defaultExp = { expDamage: 800, expSpot: 1.2, expFrag: 0.8, expDef: 0.5, expWinRate: 0.49 }
    overallWn8 = calculateWn8(rawStats, defaultExp)
  }

  const result: WoTPlayerStats = {
    account_id,
    nickname,
    battles,
    wins,
    damage_dealt,
    frags,
    winRate: battles > 0 ? wins / battles : 0,
    avgDamage: battles > 0 ? Math.round(damage_dealt / battles) : 0,
    avgFrags: battles > 0 ? frags / battles : 0,
    wn8: overallWn8,
    vehicles,
    cachedAt: Date.now(),
  }

  setCache(username, result)
  return result
}

export function useWargamingApi() {
  return { searchPlayer, getCached }
}
