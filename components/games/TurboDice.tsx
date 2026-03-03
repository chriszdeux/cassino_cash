"use client";

import { useState } from "react";
import { useCasinoStore } from "@/lib/store";
import { PlayRequest, PlayResponse } from "@/types/game";
import { playGameLocally } from "@/lib/gameEngine";
import { motion, AnimatePresence } from "framer-motion";
import BetControls from "@/components/ui/BetControls";
import SpriteAnimator from "@/components/ui/SpriteAnimator";

export default function TurboDice({ onPlay }: { onPlay: () => void }) {
  const [bet, setBet] = useState(10);
  const [loading, setLoading] = useState(false);
  const [sessionProfit, setSessionProfit] = useState(0);
  const [resultMsg, setResultMsg] = useState("");
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [diceSum, setDiceSum] = useState<number | null>(null);
  const { balance, setBalance } = useCasinoStore();

  const handleRoll = async (guess: "bajo" | "alto" | "siete") => {
    if (bet <= 0 || bet > balance) {
      setResultMsg("Monto de apuesta inválido");
      return;
    }

    setLoading(true);
    setResultMsg("");
    setDiceSum(null);

    // Roll animation dummy
    let val = 0;
    const interval = setInterval(() => {
        setDice([Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1] as [number, number]);
        val++;
        if (val > 10) clearInterval(interval);
    }, 50);

    try {
      const request = { gameId: "turbo-dice", betAmount: bet, currentBalance: balance, payload: { guess } } as PlayRequest;
      const data: PlayResponse = await playGameLocally(request);

      clearInterval(interval);
      if (data.success) {
        setDice(data.resultData?.dice as [number, number]);
        setDiceSum(data.resultData?.sum);
        setBalance(data.newBalance);
        setSessionProfit(prev => prev + (data.winAmount - bet));
        onPlay();
        
        if (data.resultData?.outcome === "win") {
          setResultMsg(`🎉 ¡GANASTE $${data.winAmount}! 🎉`);
        } else {
          setResultMsg(`💀 Lost. Total was ${data.resultData?.sum} 💀`);
        }
      } else {
        setResultMsg(data.message || "Error del servidor");
      }
    } catch (e) {
      clearInterval(interval);
      setResultMsg("Error de red");
    } finally {
      setLoading(false);
    }
  };

  const getDiceFace = (num: number) => {
      const faces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
      return faces[num - 1] || "⚀";
  };

  return (
    <div className="w-full flex flex-col items-center relative z-10 p-4">
      <div className="text-center mb-6 max-w-sm px-4">
         <p className="text-slate-400 text-sm font-medium tracking-wide leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5 shadow-inner">
           Lanza dos dados. Apuesta a sumas bajas (2-6), altas (8-12) o al siete exacto.
         </p>
      </div>
      <motion.div 
         className="absolute inset-0 z-0 pointer-events-none rounded-2xl overflow-hidden"
         animate={{ opacity: [0.5, 0.8, 0.5], rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
         transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <SpriteAnimator 
          baseName="Gemini_Generated_Image_oveafsoveafsovea" 
          frameCount={66} 
          cols={11}
          rows={6}
          fps={15}
          className="w-full h-full opacity-50 block"
        />
      </motion.div>
      
      <div className="flex gap-8 mb-8 z-10 text-8xl text-orange-400 drop-shadow-[0_0_20px_rgba(251,146,60,0.8)]">
         <motion.div animate={{ rotate: loading ? 360 : 0 }} transition={{ repeat: loading ? Infinity : 0, duration: 0.3 }}>
             {getDiceFace(dice[0])}
         </motion.div>
         <motion.div animate={{ rotate: loading ? -360 : 0 }} transition={{ repeat: loading ? Infinity : 0, duration: 0.3 }}>
             {getDiceFace(dice[1])}
         </motion.div>
      </div>

      <div className="h-8 mb-4 text-center z-10 relative">
        <AnimatePresence>
        {resultMsg && (
          <motion.p 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0 }}
            className={`font-black text-xl tracking-widest ${resultMsg.includes('WON') ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,1)]' : 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,1)]'}`}
          >
            {resultMsg}
          </motion.p>
        )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-6 z-10 relative w-full max-w-sm">
        <div className="grid grid-cols-3 gap-3 w-full">
          <button
            onClick={() => handleRoll("bajo")}
            disabled={loading}
            className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm px-2 py-3 rounded-xl border border-orange-500/50 hover:border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)] disabled:opacity-50"
          >
            LOW (2-6)<br/><span className="text-orange-400">2x</span>
          </button>
          <button
            onClick={() => handleRoll("siete")}
            disabled={loading}
            className="bg-orange-800 hover:bg-orange-700 text-white font-bold text-sm px-2 py-3 rounded-xl border border-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.6)] disabled:opacity-50"
          >
            SEVEN (7)<br/><span className="text-yellow-400">4x</span>
          </button>
          <button
            onClick={() => handleRoll("alto")}
            disabled={loading}
            className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm px-2 py-3 rounded-xl border border-orange-500/50 hover:border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)] disabled:opacity-50"
          >
            HIGH (8-12)<br/><span className="text-orange-400">2x</span>
          </button>
        </div>
        <BetControls bet={bet} setBet={setBet} loading={loading} sessionProfit={sessionProfit} />
      </div>
    </div>
  );
}
