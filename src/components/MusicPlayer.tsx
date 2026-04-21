import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

const TRACKS = [
  {
    title: "Cyber Pulse",
    artist: "Neural Link Orchestra",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#00ffff",
    meta: "Synthwave • 128 BPM"
  },
  {
    title: "Midnight Grid",
    artist: "Lo-fi Tech Collective",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#ff00ff",
    meta: "Lo-fi Tech • 95 BPM"
  },
  {
    title: "Neon Horizon",
    artist: "Retrowave AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#00ffff",
    meta: "Retrowave • 110 BPM"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => {
        console.error("Autoplay prevented", e);
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const percentage = (audio.currentTime / audio.duration) * 100;
      setProgress(percentage || 0);
      setCurrentTime(formatTime(audio.currentTime));
      setDuration(formatTime(audio.duration));
    };

    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, []);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  return (
    <div className="w-full h-full flex items-center justify-between px-12 bg-black border-t-2 border-[#00ffff]">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleNext}
      />

      {/* Left: Track Info */}
      <div className="flex items-center gap-6 w-1/3">
        <div className="w-10 h-10 border-2 border-[#ff00ff] overflow-hidden magenta-glow flex-shrink-0">
          <img 
            src={`https://picsum.photos/seed/${currentTrackIndex}/100/100`} 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="overflow-hidden font-mono uppercase tracking-tighter">
          <p className="text-xs font-black truncate glitch-text" data-text={currentTrack.title}>{currentTrack.title}</p>
          <p className="text-[9px] text-[#00ffff]/60 truncate tracking-[0.2em]">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Center: Controls & Progress */}
      <div className="flex-1 flex flex-col items-center gap-1 max-w-2xl px-8">
        <div className="flex items-center gap-10">
          <button 
            onClick={handlePrev}
            className="group text-[#ff00ff]/50 hover:text-[#ff00ff] transition-colors"
          >
            <SkipBack className="w-4 h-4 fill-current glitch-shake" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`group w-10 h-10 border-2 flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${isPlaying ? 'border-[#ff00ff] text-[#ff00ff] magenta-glow' : 'border-[#00ffff] text-[#00ffff] cyan-glow'}`}
          >
            <div className="glitch-shake">
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
            </div>
          </button>
          <button 
            onClick={handleNext}
            className="group text-[#ff00ff]/50 hover:text-[#ff00ff] transition-colors"
          >
            <SkipForward className="w-4 h-4 fill-current glitch-shake" />
          </button>
        </div>
        
        <div className="w-full flex items-center gap-4 py-1 glitch-flicker">
          <span className="text-[9px] font-mono text-[#00ffff]/40 w-10 text-right">{currentTime}</span>
          <div className="flex-1 h-0.5 bg-[#00ffff]/10 relative group cursor-crosshair overflow-hidden">
            <motion.div 
              initial={false}
              animate={{ width: `${progress}%` }}
              className="absolute top-0 left-0 h-full bg-[#00ffff] cyan-glow shadow-[0_0_10px_#00ffff]" 
            />
          </div>
          <span className="text-[9px] font-mono text-[#00ffff]/40 w-10">{duration}</span>
        </div>
      </div>

      {/* Right: Volume / Extras */}
      <div className="w-1/3 flex justify-end items-center gap-6">
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-[#00ffff]/40" />
          <div className="w-20 h-0.5 bg-[#00ffff]/10 relative">
            <div className="absolute top-0 left-0 h-full w-2/3 bg-[#00ffff]/60"></div>
          </div>
        </div>
        <div className="h-6 w-px bg-[#00ffff]/20" />
        <span className="text-[9px] font-mono tracking-widest text-[#00ffff]/40 uppercase">Audio_Link_V1</span>
      </div>
    </div>
  );
}
