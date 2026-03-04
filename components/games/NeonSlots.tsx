"use client";

import { useState, useEffect, useRef } from "react";
import { useCasinoStore } from "@/lib/store";
import { PlayRequest } from "@/types/game";
import { playGameLocally } from "@/lib/gameEngine";
import { motion, AnimatePresence } from "framer-motion";
import BetControls from "@/components/ui/BetControls";
import confetti from "canvas-confetti";

export default function NeonSlots({ onPlay }: { onPlay: () => void }) {
  const [bet, setBet] = useState(10);
  const [loading, setLoading] = useState(false);
  const [sessionProfit, setSessionProfit] = useState(0);
  const [reels, setReels] = useState(["❔", "❔", "❔"]);
  const [resultMsg, setResultMsg] = useState("");
  const { balance, setBalance, volume, isMuted } = useCasinoStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const spinAudioRef = useRef<HTMLAudioElement>(null);

  // Background specific music for NeonSlots
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume * 0.5; // Backing track lower
      audioRef.current.muted = isMuted;
    }
    if (spinAudioRef.current) {
      spinAudioRef.current.volume = volume;
      spinAudioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          audioRef.current.currentTime = 0; // Restart track fresh
          await audioRef.current.play();
        } catch (err) {
          console.warn("NeonSlots Autoplay prevented:", err);
        }
      }
    };
    playAudio();
  }, []);

  const handleSpin = async () => {
    if (bet <= 0 || bet > balance) {
      setResultMsg("Monto de apuesta inválido");
      return;
    }

    setLoading(true);
    setResultMsg("");

    if (spinAudioRef.current) {
       spinAudioRef.current.currentTime = 0;
       spinAudioRef.current.play().catch(() => {});
    }

    // Simulate pre-fetch spinning effect locally
    setReels(["🎰", "🎰", "🎰"]);
    const spinInterval = setInterval(() => {
        const symbols = ['🍒', '🍋', '⭐', '💎', '7️⃣'];
        setReels([
           symbols[Math.floor(Math.random() * symbols.length)],
           symbols[Math.floor(Math.random() * symbols.length)],
           symbols[Math.floor(Math.random() * symbols.length)]
        ]);
    }, 100);

    try {
      const request = { gameId: "neon-slots", betAmount: bet, currentBalance: balance } as PlayRequest;
      const [data] = await Promise.all([
          playGameLocally(request),
          new Promise(resolve => setTimeout(resolve, 3500)) // Force minimum 5s spin duration per user request
      ]);
      
      clearInterval(spinInterval);

      if (data.success) {
        setReels(data.resultData?.symbols || ["❌", "❌", "❌"]);
        setBalance(data.newBalance);
        setSessionProfit(prev => prev + (data.winAmount - bet));
        onPlay();
        
        if (data.winAmount > 0) {
          setResultMsg(`🎉 ¡GANASTE $${data.winAmount}! 🎉`);
          confetti({
             particleCount: 150,
             spread: 60,
             origin: { y: 0.6 },
             colors: ['#f0abfc', '#c084fc', '#2dd4bf', '#fbbf24'] // Neon colors
          });
        } else {
          setResultMsg("💀 Has perdido 💀");
        }
      } else {
        setResultMsg(data.message || "Error del servidor");
      }
    } catch {
      clearInterval(spinInterval);
      setResultMsg("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <audio ref={audioRef} src="/sounds/Neon_Jackpot_Nebula.mp3" loop />
      <audio ref={spinAudioRef} src="/sounds/slot_machine.mp3" preload="auto" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 blur-3xl mix-blend-screen"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      </div>

      <div className="text-center mb-6 w-full max-w-lg px-4 relative z-10 flex flex-col md:flex-row shadow-[0_0_20px_rgba(236,72,153,0.1)] rounded-xl border border-fuchsia-500/20 bg-black/60 backdrop-blur-sm items-center py-4">
         <div className="flex-1 px-4 mb-4 md:mb-0">
           <h3 className="text-pink-400 font-bold tracking-widest text-lg drop-shadow-[0_0_8px_rgba(236,72,153,0.8)] uppercase">
             Tragamonedas Neón
           </h3>
           <p className="text-slate-300 text-xs mt-1 leading-relaxed">
             Multiplica tu apuesta alineando los brillantes cristales. Alinéa 2 para recuperar, ¡alinéa 3 para el premio mayor!
           </p>
         </div>
         {/* Decorative Canvas representation */}
         <div className="w-24 h-24 mx-4 relative border border-purple-500/30 rounded-lg shrink-0 flex items-center justify-center p-2 bg-[#0a0515] overflow-hidden shadow-inner flex-wrap content-center gap-1">
             <div className="w-5 h-5 bg-pink-500/20 rounded-full border border-pink-400 animate-pulse delay-75 shadow-[0_0_10px_#ec4899]"></div>
             <div className="w-5 h-5 bg-cyan-500/20 border border-cyan-400 opacity-50 shadow-[0_0_10px_#22d3ee]"></div>
             <div className="w-5 h-5 bg-purple-500/20 rounded-md border border-purple-400 opacity-50 shadow-[0_0_10px_#a855f7]"></div>
             <div className="w-5 h-5 bg-pink-500/20 border border-pink-400 shadow-[0_0_10px_#ec4899]"></div>
             <div className="w-5 h-5 bg-yellow-500/20 rounded-full border border-yellow-400 opacity-50 shadow-[0_0_10px_#eab308]"></div>
             <div className="w-5 h-5 bg-pink-500/20 rounded-full border border-pink-400 animate-pulse shadow-[0_0_10px_#ec4899]"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-500/10 to-transparent pointer-events-none mix-blend-screen" />
         </div>
      </div>
      
      <div className="flex gap-4 md:gap-6 mb-8 bg-[#0b0712]/90 p-6 md:p-8 rounded-3xl border border-fuchsia-500/40 shadow-[0_0_30px_rgba(236,72,153,0.3),inset_0_0_20px_rgba(0,0,0,0.8)] relative z-10 w-full max-w-md justify-center">
        {reels.map((symbol, i) => (
          <motion.div
            key={i}
            animate={{ 
               y: loading ? [0, -40, 0] : 0, 
               scale: loading ? 1 : [1, 1.05, 1],
               filter: loading ? "blur(4px)" : "blur(0px)"
            }}
            transition={{ 
               y: { repeat: loading ? Infinity : 0, duration: 0.25, ease: "linear" },
               scale: { repeat: Infinity, duration: 2, delay: i * 0.2 },
               filter: { duration: 0.1 }
            }}
            className="w-20 h-28 md:w-28 md:h-36 bg-gradient-to-b from-[#151020] to-[#0a0510] border-[3px] border-fuchsia-500/60 rounded-2xl flex items-center justify-center text-5xl md:text-7xl shadow-[0_0_20px_rgba(217,70,239,0.2),inset_0_0_15px_rgba(0,0,0,0.9)] font-mono overflow-hidden relative"
          >
            <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none ${loading ? '' : 'animate-shimmer'}`} style={{backgroundSize: '200% 200%'}} />
            <span className="drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] relative z-10">
              {symbol}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="h-10 mb-4 text-center relative z-10">
        <AnimatePresence mode="wait">
          {resultMsg && (
            <motion.p 
              key={resultMsg}
              initial={{ opacity: 0, scale: 0.5, y: -20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              className={`font-black text-2xl md:text-3xl tracking-widest uppercase ${resultMsg.includes('GANASTE') ? 'text-green-300 drop-shadow-[0_0_20px_rgba(74,222,128,1)]' : 'text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]'}`}
            >
              {resultMsg}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
         <BetControls bet={bet} setBet={setBet} loading={loading} sessionProfit={sessionProfit} />
         
         <button 
           onClick={handleSpin} 
           disabled={loading}
           className="group mt-6 w-full max-w-[280px] py-4 rounded-xl font-black text-2xl md:text-3xl uppercase tracking-widest transition-all bg-gradient-to-tr from-fuchsia-700 to-pink-500 hover:from-fuchsia-600 hover:to-pink-400 text-white shadow-[0_0_30px_rgba(236,72,153,0.6)] hover:shadow-[0_0_50px_rgba(236,72,153,1)] border border-pink-300 disabled:opacity-50 disabled:grayscale relative overflow-hidden"
         >
           <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-diamond-shine mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
           <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] relative z-10 flex items-center justify-center gap-3">
             {loading ? (
               <span className="animate-pulse">GIRANDO...</span>
             ) : (
               <>
                 <span className="text-xl md:text-2xl drop-shadow-[0_0_10px_white] animate-pulse">💎</span>
                 <span>¡GIRAR!</span>
                 <span className="text-xl md:text-2xl drop-shadow-[0_0_10px_white] animate-pulse">💎</span>
               </>
             )}
           </span>
         </button>
      </div>
    </div>
  );
}
