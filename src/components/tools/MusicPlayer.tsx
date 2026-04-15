import { useState, useEffect, useRef, useCallback } from 'react';
import musicData from '../../data/music.json';

interface Track {
  id: string;
  title: string;
  album: string;
  coverUrl: string;
  src: string;
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

const tracks: Track[] = musicData.tracks as Track[];

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
  const audioRef = useRef<HTMLAudioElement>(null);
  const generationRef = useRef(0);

  const currentTrack = tracks[currentIndex] ?? null;

  const generateShuffle = useCallback((idx: number) => {
    const order = fisherYates(tracks.length);
    setShuffleOrder(order);
    const pos = order.indexOf(idx);
    setShufflePos(pos >= 0 ? pos : 0);
    return order;
  }, []);

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
  }, [repeatMode, shuffleMode, shuffleOrder, shufflePos, currentIndex, generateShuffle]);

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
  }, [repeatMode, shuffleMode, shuffleOrder, shufflePos, currentIndex, generateShuffle]);

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
  }, [currentIndex]);

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
