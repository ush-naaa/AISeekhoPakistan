import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cpu, Zap, Activity, Shield, Terminal } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col bg-black text-[#00ffff] font-sans overflow-hidden selection:bg-[#ff00ff] selection:text-black">
      {/* GLOBAL_DECORATIONS */}
      <div className="fixed inset-0 static-noise z-[100] pointer-events-none" />
      <div className="fixed inset-0 crt-lines z-[101] pointer-events-none" />
      
      {/* HEADER: DATA_COLLECTOR */}
      <header className="h-16 border-b-2 border-[#ff00ff] bg-black flex items-center justify-between px-8 z-10 relative shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="magenta-glow"
            >
              <Cpu className="w-8 h-8 text-[#ff00ff]" />
            </motion.div>
            <h1 className="font-mono text-xl tracking-tighter uppercase glitch-text" data-text="SYSTEM_OVERRIDE">
              SYSTEM_OVERRIDE
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-8 border-l-2 border-[#ff00ff]/30 pl-8 font-mono">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#ff00ff]/60 uppercase tracking-[0.2em]">Kernel_Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00ffff] animate-pulse shadow-[0_0_8px_#00ffff]" />
                <span className="text-xs uppercase">STABLE_V4.2.0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs">
          <div className="flex items-center gap-2 border-2 border-[#00ffff]/20 px-3 py-1 bg-black">
            <Activity className="w-4 h-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 border-2 border-[#ff00ff]/20 px-3 py-1 bg-black">
            <Shield className="w-4 h-4 text-[#ff00ff]" />
            <span className="uppercase">Nodes_Secured</span>
          </div>
        </div>
      </header>

      {/* MAIN: EXECUTION_CORE */}
      <main className="flex-1 flex overflow-hidden z-10 relative">
        {/* SIDEBAR: MONITOR_LOGS */}
        <aside className="w-72 border-r-2 border-[#00ffff] bg-black overflow-hidden flex flex-col shrink-0">
          <div className="p-4 border-b-2 border-[#00ffff]/20 bg-[#00ffff]/10 translate-y-[-1px]">
            <span className="text-xs font-mono uppercase tracking-[0.3em] font-bold">MONITOR_LOGS</span>
          </div>
          
          <div className="flex-1 p-4 font-mono text-[11px] space-y-4 overflow-y-auto">
            <div className="border-l-2 border-[#00ffff] pl-3 py-1 bg-[#00ffff]/5">
              <p className="text-[#00ffff]/50">INIT_SEQUENCE_SUCCESS</p>
              <p className="text-white">Mapping_Visual_Buffer...</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-[#ff00ff] uppercase">Critical_Error:</p>
              <p className="pl-4 opacity-70">Artifact_Detected_In_Sector_7</p>
              <div className="h-1 bg-[#ff00ff]/20 w-full mt-2" />
            </div>

            <div className="pt-4 space-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase tracking-widest text-[#00ffff]">Audio_Analysis</span>
                <div className="h-24 bg-[#00ffff]/5 border border-[#00ffff]/20 relative overflow-hidden flex items-end justify-between p-2">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['10%', '80%', '30%', '90%', '15%'] }}
                      transition={{ duration: 0.5 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                      className="w-1 bg-[#00ffff] opacity-40 shadow-[0_0_5px_#00ffff]"
                    />
                  ))}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center border-t-2 border-[#00ffff]/30">
                    <span className="bg-black px-2 py-0.5 text-[9px] tracking-widest text-[#00ffff] border border-[#00ffff]">ANALYSIS_PENDING</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#ff00ff]/40 p-3 bg-[#ff00ff]/10 flex items-center gap-3">
              <Zap className="w-4 h-4 text-[#ff00ff] animate-pulse" />
              <p className="text-[9px] uppercase leading-tight font-bold">Sync_With_Hyperlink_Protocol_Established</p>
            </div>
          </div>
          
          <div className="p-4 border-t-2 border-[#00ffff]/20 bg-[#00ffff]/5 flex items-center gap-3">
            <Terminal className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest opacity-60 uppercase">System_Awaiting_Cmd</span>
          </div>
        </aside>

        {/* CONTENT: CENTRAL_PROCESSOR */}
        <section className="flex-1 bg-black relative flex items-center justify-center p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10" 
               style={{ backgroundImage: `radial-gradient(circle at center, #ff00ff 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />
          
          <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center">
            {/* CORNER_MARKERS */}
            <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-[#ff00ff] magenta-glow" />
            <div className="absolute -top-4 -right-4 w-12 h-12 border-t-4 border-r-4 border-[#00ffff] cyan-glow" />
            <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-4 border-l-4 border-[#00ffff] cyan-glow" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-4 border-r-4 border-[#ff00ff] magenta-glow" />
            
            <SnakeGame />
          </div>
        </section>
      </main>

      {/* FOOTER: AUDIO_INTERFACE */}
      <footer className="h-16 border-t-2 border-[#00ffff] bg-black z-20 relative shrink-0">
        <MusicPlayer />
      </footer>
    </div>
  );
}

