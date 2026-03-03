"use client";

import { useState, useRef, useEffect } from "react";
import { useCasinoStore } from "@/lib/store";
import { PlayRequest, PlayResponse } from "@/types/game";
import { playGameLocally } from "@/lib/gameEngine";
import { motion, AnimatePresence } from "framer-motion";
import BetControls from "@/components/ui/BetControls";
import SpriteAnimator from "@/components/ui/SpriteAnimator";

export default function VoidCrash({ onPlay }: { onPlay: () => void }) {
  const [bet, setBet] = useState(10);
  const [targetMultiplier, setTargetMultiplier] = useState(2.0);
  const [loading, setLoading] = useState(false);
  const [sessionProfit, setSessionProfit] = useState(0);
  const [resultMsg, setResultMsg] = useState("");
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const { balance, setBalance } = useCasinoStore();
  const animRef = useRef<number | null>(null);

  const handleLaunch = async () => {
    if (bet <= 0 || bet > balance || targetMultiplier <= 1) {
      setResultMsg("Apuesta o retiro inválido");
      return;
    }

    setLoading(true);
    setResultMsg("");
    setCurrentMultiplier(1.0);

    try {
      const request = { gameId: "void-crash", betAmount: bet, currentBalance: balance, payload: { targetMultiplier } } as PlayRequest;
      const data: PlayResponse = await playGameLocally(request);

      if (data.success) {
        animateMultiplier(data.resultData?.crashPoint, data.resultData?.outcome, data);
      } else {
        setResultMsg(data.message || "Error del servidor");
        setLoading(false);
      }
    } catch (e) {
      setResultMsg("Error de red");
      setLoading(false);
    }
  };

  const animateMultiplier = (crashPoint: number, outcome: string, data: PlayResponse) => {
    let start = performance.now();
    const duration = 2000; // 2s crash animation
    
    const animate = (time: number) => {
      let progress = (time - start) / duration;
      if (progress > 1) progress = 1;
      
      const eclapsedMultiplier = 1.0 + (crashPoint - 1.0) * (progress * progress); // Ease-in curve
      setCurrentMultiplier(eclapsedMultiplier);

      if (progress < 1) {
         animRef.current = requestAnimationFrame(animate);
      } else {
         setBalance(data.newBalance);
        setSessionProfit(prev => prev + (data.winAmount - bet));
         onPlay();
         setLoading(false);
         if (outcome === "win") {
            setResultMsg(`🎉 COBRASTE $${data.winAmount}! 🎉`);
         } else {
            setResultMsg(`💥 EXPLOTÓ EN ${crashPoint.toFixed(2)}x 💥`);
         }
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const isCrashed = !loading && currentMultiplier > 1 && resultMsg.includes("CRASH");

  return (
    <div className="w-full flex flex-col items-center relative z-10 px-4">
      <div className="text-center mb-6 max-w-sm px-4">
         <p className="text-slate-400 text-sm font-medium tracking-wide leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5 shadow-inner">
           El multiplicador sube. Retira tus ganancias antes de que el vacío explote.
         </p>
      </div>
      {/* Background stars / void simulation */}
      <motion.div 
         className="absolute inset-x-0 bottom-0 z-0 pointer-events-none rounded-2xl overflow-hidden h-[500px]"
         animate={{ y: loading ? [0, 50] : 0, scale: loading ? [1, 1.2] : 1, filter: ["contrast(1)", "contrast(1.5)"] }}
         transition={{ duration: 2, ease: "linear", repeat: loading ? Infinity : 0 }}
      >
        <SpriteAnimator 
          baseName="Gemini_Generated_Image_ppsv1sppsv1sppsv" 
          frameCount={66} 
          cols={11}
          rows={6}
          fps={20}
          className="w-full h-full opacity-60 mix-blend-screen"
        />
      </motion.div>
      
      <div className="relative z-10 w-full max-w-sm h-48 border-b-4 border-l-4 border-indigo-500/30 flex items-center justify-center mb-8 bg-black/40 shadow-inner overflow-hidden rounded-tr-3xl">
         <motion.div 
           className="w-8 h-8 rounded-full shadow-[0_0_20px_purple] z-20"
           animate={{ 
              x: loading ? [0, 100, 200] : (isCrashed ? 200 : 0),
              y: loading ? [0, -50, -100] : (isCrashed ? -100 : 0),
              backgroundColor: isCrashed ? "#ef4444" : "#a855f7" 
           }}
           transition={{ duration: 2, ease: "easeIn" }}
         />
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className={`text-6xl font-black tabular-nums tracking-tighter ${isCrashed ? "text-red-500 line-through" : "text-indigo-200"}`}>
               {currentMultiplier.toFixed(2)}x
            </span>
         </div>
      </div>

      <div className="h-8 mb-4 text-center z-10 relative">
        <AnimatePresence>
        {resultMsg && (
          <motion.p 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0 }}
            className={`font-black text-xl tracking-widest ${resultMsg.includes('CASHED') ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,1)]' : 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,1)]'}`}
          >
            {resultMsg}
          </motion.p>
        )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-4 z-10 relative w-full max-w-xs">
        <button
          onClick={handleLaunch}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xl px-12 py-3 rounded-xl border border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5)] disabled:opacity-50"
        >
          {loading ? "VOLANDO..." : "DESPEGAR"}
        </button>
        <BetControls bet={bet} setBet={setBet} loading={loading} sessionProfit={sessionProfit} />
         <div className="flex items-center justify-between bg-black/90 px-4 py-3 rounded-xl border border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)] mt-2 w-full max-w-[280px]">
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Retirar en:</label>
            <input 
              type="number" 
              step="0.1" 
              disabled={loading} 
              value={targetMultiplier} 
              onChange={(e) => setTargetMultiplier(Number(e.target.value))} 
              className="w-16 bg-transparent text-white font-black outline-none text-right pr-2 text-2xl"
            />
         </div>
      </div>
    </div>
  );
}
