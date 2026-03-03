"use client";

import { useState } from "react";
import { useCasinoStore } from "@/lib/store";
import { PlayRequest, PlayResponse } from "@/types/game";
import { playGameLocally } from "@/lib/gameEngine";
import { motion, AnimatePresence } from "framer-motion";
import BetControls from "@/components/ui/BetControls";
import SpriteAnimator from "@/components/ui/SpriteAnimator";

export default function BinaryFlip({ onPlay }: { onPlay: () => void }) {
  const [bet, setBet] = useState(10);
  const [loading, setLoading] = useState(false);
  const [sessionProfit, setSessionProfit] = useState(0);
  const [resultMsg, setResultMsg] = useState("");
  const [coinSide, setCoinSide] = useState<"cara" | "cruz" | null>(null);
  const { balance, setBalance } = useCasinoStore();

  const handleFlip = async (choice: "cara" | "cruz") => {
    if (bet <= 0 || bet > balance) {
      setResultMsg("Monto de apuesta inválido");
      return;
    }

    setLoading(true);
    setResultMsg("");
    setCoinSide(null);

    try {
      const request = { gameId: "binary-flip", betAmount: bet, currentBalance: balance, payload: { choice } } as PlayRequest;
      const data: PlayResponse = await playGameLocally(request);

      if (data.success) {
        setCoinSide(data.resultData?.coin);
        setBalance(data.newBalance);
        setSessionProfit(prev => prev + (data.winAmount - bet));
        onPlay();
        
        setTimeout(() => {
          if (data.resultData?.outcome === "win") {
            setResultMsg(`🎉 ¡GANASTE $${data.winAmount}! 🎉`);
          } else {
            setResultMsg("💀 Has perdido 💀");
          }
        }, 500); // Wait for flip animation
      } else {
        setResultMsg(data.message || "Error del servidor");
      }
    } catch (e) {
      setResultMsg("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center relative z-10">
      <div className="text-center mb-6 max-w-sm px-4">
         <p className="text-slate-400 text-sm font-medium tracking-wide leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5 shadow-inner">
           Lanza la moneda digital. Elige Cara o Cruz para ganar.
         </p>
      </div>
      {/* Decorative generated sprite flowing in background */}
      <motion.div 
         className="absolute inset-0 z-0 pointer-events-none rounded-2xl overflow-hidden"
         animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1], filter: ["hue-rotate(0deg)", "hue-rotate(30deg)", "hue-rotate(0deg)"] }}
         transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <SpriteAnimator 
          baseName="Gemini_Generated_Image_21fiqf21fiqf21fi" 
          frameCount={66} 
          cols={11}
          rows={6}
          fps={12}
          className="w-full h-full opacity-40 mix-blend-screen"
        />
      </motion.div>
      
      <div className="relative z-10 w-40 h-40 perspect-1000 mb-8 flex justify-center items-center">
         <motion.div 
            className="w-32 h-32 rounded-full border-4 shadow-[0_0_30px_rgba(52,211,153,0.5)] flex items-center justify-center text-4xl font-bold border-emerald-400 bg-emerald-900 text-emerald-100"
            animate={{ 
               rotateY: loading ? parseInt("1440") : (coinSide === "cara" ? 0 : (coinSide === "cruz" ? 180 : 0)),
               scale: loading ? [1, 1.2, 1] : 1
            }}
            transition={{ duration: loading ? 1.5 : 0.5, ease: "easeInOut", repeat: loading ? Infinity : 0 }}
         >
             {loading ? "?" : (coinSide === "cara" ? "H" : (coinSide === "cruz" ? "T" : "₿"))}
         </motion.div>
      </div>

      <div className="h-8 mb-4 text-center z-10 relative">
        <AnimatePresence>
        {resultMsg && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            className={`font-black text-xl tracking-widest ${resultMsg.includes('WON') ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,1)]' : 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,1)]'}`}
          >
            {resultMsg}
          </motion.p>
        )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-4 z-10 relative">
        <div className="flex gap-4">
          <button
            onClick={() => handleFlip("cara")}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg px-8 py-2 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.4)] disabled:opacity-50"
          >
            HEADS
          </button>
          <button
            onClick={() => handleFlip("cruz")}
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-lg px-8 py-2 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.4)] disabled:opacity-50"
          >
            TAILS
          </button>
        </div>
        <BetControls bet={bet} setBet={setBet} loading={loading} sessionProfit={sessionProfit} />
      </div>
    </div>
  );
}
