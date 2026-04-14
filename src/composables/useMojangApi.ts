const CACHE_KEY = 'mojang_cache'
const TIMEOUT_MS = 10_000

export interface MojangVersionInfo {
  javaLatestRelease: string
  javaLatestSnapshot: string
  bedrockLatestRelease: string
  releaseDate: string
  cachedAt: number
}

interface VersionManifest {
  latest: {
    release: string
    snapshot: string
  }
  versions: Array<{
    id: string
    type: string
    releaseTime: string
  }>
}

function getCached(): MojangVersionInfo | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (raw) return JSON.parse(raw) as MojangVersionInfo
  } catch {
    // ignore
  }
  return null
}

function setCache(data: MojangVersionInfo): void {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}

export async function fetchMojangVersions(): Promise<MojangVersionInfo> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(
      'https://launchermeta.mojang.com/mc/game/version_manifest.json',
      { signal: controller.signal }
    )
    clearTimeout(timer)

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const manifest: VersionManifest = await res.json()

    const javaLatestRelease = manifest.latest.release
    const javaLatestSnapshot = manifest.latest.snapshot

    // Bedrock is not in the Java manifest; use a placeholder
    const bedrockLatestRelease = 'N/A'

    // Find release date of the latest release version
    const releaseEntry = manifest.versions.find(
      (v) => v.id === javaLatestRelease && v.type === 'release'
    )
    const releaseDate = releaseEntry
      ? releaseEntry.releaseTime.split('T')[0]
      : ''

    const result: MojangVersionInfo = {
      javaLatestRelease,
      javaLatestSnapshot,
      bedrockLatestRelease,
      releaseDate,
      cachedAt: Date.now(),
    }

    setCache(result)
    return result
  } catch (err) {
    clearTimeout(timer)
    const cached = getCached()
    if (cached) return cached
    throw err
  }
}

export function useMojangApi() {
  return { fetchMojangVersions, getCached }
}
