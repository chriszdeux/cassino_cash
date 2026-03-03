"use client";

import { useState, useEffect } from "react";
import { useCasinoStore } from "@/lib/store";
import { PlayRequest, PlayResponse } from "@/types/game";
import { playGameLocally } from "@/lib/gameEngine";
import { motion, AnimatePresence } from "framer-motion";
import BetControls from "@/components/ui/BetControls";

export default function SignalGuess({ onPlay }: { onPlay: () => void }) {
  const [bet, setBet] = useState(10);
  const [loading, setLoading] = useState(false);
  const [sessionProfit, setSessionProfit] = useState(0);
  const [resultMsg, setResultMsg] = useState("");
  const [currentSignal, setCurrentSignal] = useState(50);
  const [history, setHistory] = useState<number[]>([50]);
  const { balance, setBalance } = useCasinoStore();

  const handleGuess = async (guess: "mayor" | "menor") => {
    if (bet <= 0 || bet > balance) {
      setResultMsg("Monto de apuesta inválido");
      return;
    }

    setLoading(true);
    setResultMsg("");

    try {
      const request = { gameId: "signal-guess", betAmount: bet, currentBalance: balance, payload: { guess, currentSignal } } as PlayRequest;
      const data: PlayResponse = await playGameLocally(request);

      if (data.success) {
        const nextSignal = data.resultData?.nextSignal;
        setCurrentSignal(nextSignal);
        setHistory([...history, nextSignal]);
        setBalance(data.newBalance);
        setSessionProfit(prev => prev + (data.winAmount - bet));
        onPlay();
        
        if (data.resultData?.outcome === "win") {
          setResultMsg(`🎉 CORRECT! Signal moved to ${nextSignal}! 🎉`);
        } else {
          setResultMsg(`💀 WRONG! Signal moved to ${nextSignal} 💀`);
        }
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
    <div className="w-full flex flex-col items-center relative z-10 p-4">
      <div className="text-center mb-6 max-w-sm px-4">
         <p className="text-slate-400 text-sm font-medium tracking-wide leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5 shadow-inner">
           Adivina si la próxima señal será mayor o menor a la actual.
         </p>
      </div>
      {/* Dynamic Graph Background */}
      <div className="w-full max-w-sm h-32 mb-8 bg-neutral-900 border border-fuchsia-500/30 rounded-xl flex items-end relative overflow-hidden p-2 gap-1 backdrop-blur-sm">
         <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-fuchsia-900/40 to-transparent" />
         
         {history.slice(-20).map((sig, i) => (
             <motion.div 
               key={i}
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: `${sig}%`, opacity: 1 }}
               transition={{ duration: 0.5, type: "spring" }}
               className="flex-1 bg-fuchsia-500 rounded-t-sm opacity-80"
             />
         ))}
      </div>

      <div className="text-8xl font-black tabular-nums tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-fuchsia-300 to-fuchsia-600 mb-8 drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
         <motion.span animate={{ scale: loading ? [1, 1.1, 1] : 1 }} transition={{ repeat: loading ? Infinity : 0, duration: 0.5 }}>
             {currentSignal}
         </motion.span>
      </div>

      <div className="h-8 mb-6 text-center z-10 relative">
        <AnimatePresence>
        {resultMsg && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            className={`font-black tracking-widest ${resultMsg.includes('CORRECT') ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,1)]' : 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,1)]'}`}
          >
            {resultMsg}
          </motion.p>
        )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center z-10 relative w-full mb-4">
        <div className="flex gap-8 mb-6">
          <button
            onClick={() => handleGuess("mayor")}
            disabled={loading}
            className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-green-500 bg-green-950 hover:bg-green-900 shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50"
          >
            <span className="text-3xl mb-1 text-green-400">📈</span>
            <span className="text-white font-bold tracking-widest text-sm">MAYOR</span>
          </button>
          <button
            onClick={() => handleGuess("menor")}
            disabled={loading}
            className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-red-500 bg-red-950 hover:bg-red-900 shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:opacity-50"
          >
            <span className="text-3xl mb-1 text-red-400">📉</span>
            <span className="text-white font-bold tracking-widest text-sm">MENOR</span>
          </button>
        </div>
        <BetControls bet={bet} setBet={setBet} loading={loading} sessionProfit={sessionProfit} />
      </div>
    </div>
  );
}
