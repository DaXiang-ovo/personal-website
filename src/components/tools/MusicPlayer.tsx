import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import musicData from '../../data/music.json';
import type { MetingSong } from '@lib/meting';
import { resolvePlaylist } from '@lib/meting';
import { bgmConfig } from '@constants/site-config';

interface Track {
  id: string;
  title: string;
  album: string;
  coverUrl: string;
  src: string;
}

interface MusicData {
  playlistUrl?: string;
  tracks: Track[];
}

type RepeatMode = 'none' | 'single' | 'playlist';

function fisherYates(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function MusicPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');
  const [shuffleOrder, setShuffleOrder] = useState<number[]>([]);
  const [shufflePos, setShufflePos] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [_consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [metingTracks, setMetingTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const generationRef = useRef(0);

  // Use meting tracks if available, otherwise fallback to local tracks
  const tracks = useMemo(
    () => metingTracks.length > 0 ? metingTracks : musicData.tracks,
    [metingTracks]
  );
  const currentTrack = useMemo(
    () => tracks[currentIndex] ?? null,
    [tracks, currentIndex]
  );

  // Fetch NetEase Cloud Music playlist if playlistUrl is provided
  useEffect(() => {
    const playlistUrl = musicData.playlistUrl;
    if (!playlistUrl) return;

    const fetchPlaylist = async () => {
      setLoading(true);
      setError(null);
      try {
        const metingApi = bgmConfig.metingApi || 'https://163.hyc.moe/';
        const metingSongs = await resolvePlaylist([playlistUrl], metingApi);

        if (metingSongs.length === 0) {
          throw new Error('No songs found in playlist');
        }

        // Map MetingSong to Track format
        const mappedTracks: Track[] = metingSongs.map((song, index) => ({
          id: song.id || String(index + 1),
          title: song.name || `Track ${index + 1}`,
          album: song.artist || '',
          coverUrl: song.pic || musicData.tracks[index]?.coverUrl || '/images/eason-cover.jpg',
          src: song.url || '',
        }));

        // Filter out tracks without audio URL
        const validTracks = mappedTracks.filter(track => track.src);
        if (validTracks.length === 0) {
          throw new Error('No valid audio URLs found in playlist');
        }

        setMetingTracks(validTracks);
        // Reset to first track if current index is out of bounds
        if (currentIndex >= validTracks.length) {
          setCurrentIndex(0);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load playlist');
        console.error('Failed to fetch playlist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, []); // Run only on mount

  const generateShuffle = useCallback((idx: number) => {
    const order = fisherYates(tracks.length);
    setShuffleOrder(order);
    const pos = order.indexOf(idx);
    setShufflePos(pos >= 0 ? pos : 0);
    return order;
  }, [tracks.length]);

  const goNext = useCallback(() => {
    if (tracks.length === 0) return;
    if (repeatMode === 'single') return;
    const n = tracks.length;
    if (shuffleMode) {
      let order = shuffleOrder;
      if (order.length !== n) order = generateShuffle(currentIndex);
      const newPos = (shufflePos + 1) % n;
      setShufflePos(newPos);
      setCurrentIndex(order[newPos]);
    } else {
      setCurrentIndex(prev => (prev + 1) % n);
    }
  }, [repeatMode, shuffleMode, shuffleOrder, shufflePos, currentIndex, generateShuffle, tracks.length]);

  const goPrev = useCallback(() => {
    if (tracks.length === 0) return;
    if (repeatMode === 'single') return;
    const n = tracks.length;
    if (shuffleMode) {
      let order = shuffleOrder;
      if (order.length !== n) order = generateShuffle(currentIndex);
      const newPos = (shufflePos - 1 + n) % n;
      setShufflePos(newPos);
      setCurrentIndex(order[newPos]);
    } else {
      setCurrentIndex(prev => (prev - 1 + n) % n);
    }
  }, [repeatMode, shuffleMode, shuffleOrder, shufflePos, currentIndex, generateShuffle, tracks.length]);

  // Play/pause effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    generationRef.current++;
    const gen = generationRef.current;
    audio.src = currentTrack.src;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => {
        if (gen === generationRef.current) setIsPlaying(false);
      });
    }
  }, [currentIndex, currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  // Time update
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      if (repeatMode === 'single') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        goNext();
      }
    };
    const onError = () => {
      setConsecutiveErrors(prev => {
        if (prev + 1 >= 3) {
          setIsPlaying(false);
          return 0;
        }
        goNext();
        return prev + 1;
      });
    };
    const onPlay = () => { setConsecutiveErrors(0); };
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('playing', onPlay);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('playing', onPlay);
    };
  }, [repeatMode, goNext]);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    audio.currentTime = x * duration;
  };

  const jumpTo = (idx: number) => {
    setCurrentIndex(idx);
    setIsPlaying(true);
    if (shuffleMode) {
      const pos = shuffleOrder.indexOf(idx);
      setShufflePos(pos >= 0 ? pos : 0);
    }
  };

  const fmtTime = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const cycleRepeat = () => {
    const modes: RepeatMode[] = ['none', 'playlist', 'single'];
    const idx = modes.indexOf(repeatMode);
    setRepeatMode(modes[(idx + 1) % modes.length]);
  };

  const repeatIcon = repeatMode === 'single' ? '🔂' : repeatMode === 'playlist' ? '🔁' : '➡️';

  return (
    <div className="min-h-[80vh] relative" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <audio ref={audioRef} preload="metadata" />

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Cover Art */}
        <div className="flex justify-center mb-6">
          <div className={`w-48 h-48 rounded-full border-4 border-white/10 shadow-2xl overflow-hidden ${isPlaying ? 'animate-spin-slow' : ''}`}>
            {currentTrack?.coverUrl ? (
              <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-5xl">🎵</div>
            )}
          </div>
        </div>

        {/* Track info */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-white truncate">{currentTrack?.title ?? '未知曲目'}</h2>
          <p className="text-sm text-white/50 mt-1">{currentTrack?.album ?? ''}</p>
        </div>

        {/* Loading/error state */}
        {loading && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 text-sm text-purple-300">
              <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
              正在加载网易云音乐播放列表...
            </div>
          </div>
        )}
        {error && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 text-sm text-red-300 bg-red-900/30 px-4 py-2 rounded-lg">
              <span>⚠️</span>
              <span>播放列表加载失败: {error}</span>
              <button
                onClick={() => window.location.reload()}
                className="ml-2 text-xs text-red-200 hover:text-white underline"
              >
                重试
              </button>
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1.5 bg-white/10 rounded-full cursor-pointer relative" onClick={seek}>
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all" style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }} />
          </div>
          <div className="flex justify-between text-xs text-white/40 mt-1">
            <span>{fmtTime(currentTime)}</span>
            <span>{fmtTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <button onClick={() => { setShuffleMode(!shuffleMode); if (!shuffleMode) generateShuffle(currentIndex); }} className={`text-lg transition-opacity ${shuffleMode ? 'opacity-100' : 'opacity-40'} hover:opacity-100`} title="随机播放">🔀</button>
          <button onClick={goPrev} className="text-2xl text-white/80 hover:text-white transition-colors">⏮</button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl text-white shadow-lg hover:scale-105 transition-transform">
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button onClick={goNext} className="text-2xl text-white/80 hover:text-white transition-colors">⏭</button>
          <button onClick={cycleRepeat} className={`text-lg transition-opacity ${repeatMode !== 'none' ? 'opacity-100' : 'opacity-40'} hover:opacity-100`} title={`循环模式: ${repeatMode}`}>{repeatIcon}</button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 mb-6 px-4">
          <span className="text-white/50 text-sm">🔊</span>
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(Number(e.target.value))} className="flex-1 accent-purple-500 h-1" />
          <span className="text-white/40 text-xs w-8 text-right">{Math.round(volume * 100)}</span>
        </div>

        {/* Playlist toggle */}
        <button onClick={() => setShowPlaylist(!showPlaylist)} className="w-full text-center text-sm text-white/50 hover:text-white/80 transition-colors py-2">
          {showPlaylist ? '▲ 收起列表' : '▼ 播放列表'} ({tracks.length} 首)
        </button>

        {/* Playlist */}
        {showPlaylist && (
          <div className="mt-2 max-h-80 overflow-y-auto rounded-xl bg-black/30 backdrop-blur-sm border border-white/5">
            {tracks.map((track, idx) => (
              <button
                key={track.id}
                onClick={() => jumpTo(idx)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0 ${idx === currentIndex ? 'bg-white/10' : ''}`}
              >
                <span className="text-xs text-white/30 w-6 text-right">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm truncate ${idx === currentIndex ? 'text-purple-400' : 'text-white/80'}`}>{track.title}</div>
                  <div className="text-xs text-white/30 truncate">{track.album}</div>
                </div>
                {idx === currentIndex && isPlaying && <span className="text-purple-400 text-xs">♪</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </div>
  );
}
