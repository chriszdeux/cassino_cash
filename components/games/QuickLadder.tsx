"use client";

import { useState } from "react";
import { useCasinoStore } from "@/lib/store";
import { PlayRequest, PlayResponse } from "@/types/game";
import { playGameLocally } from "@/lib/gameEngine";
import { motion, AnimatePresence } from "framer-motion";
import BetControls from "@/components/ui/BetControls";

export default function QuickLadder({ onPlay }: { onPlay: () => void }) {
  const [bet, setBet] = useState(10);
  const [loading, setLoading] = useState(false);
  const [sessionProfit, setSessionProfit] = useState(0);
  const [resultMsg, setResultMsg] = useState("");
  const [currentStep, setCurrentStep] = useState(0); // 0 (start) to 5
  const [crashed, setCrashed] = useState(false);
  const [winnings, setWinnings] = useState(0);
  const { balance, setBalance } = useCasinoStore();

  const handleClimb = async () => {
    if (loading || crashed) return;
    if (currentStep === 0 && (bet <= 0 || bet > balance)) {
      setResultMsg("Monto de apuesta inválido");
      return;
    }

    setLoading(true);
    setResultMsg("");

    const targetStep = currentStep + 1;
    // We send currentStep + 1 as risk factor.
    try {
      const request = { gameId: "quick-ladder", betAmount: bet, currentBalance: balance, payload: { step: targetStep } } as PlayRequest;
      const data: PlayResponse = await playGameLocally(request);

      if (data.success) {
        setBalance(data.newBalance);
        setSessionProfit(prev => prev + (data.winAmount - bet));
        onPlay();
        
        if (data.resultData?.outcome === "win") {
          setCurrentStep(targetStep);
          setWinnings(data.winAmount);
          setResultMsg(`🎉 SURVIVED STEP ${targetStep}! ($${data.winAmount.toFixed(2)}) 🎉`);
          if (targetStep >= 5) {
             setResultMsg(`🏆 LADDER CLEARED! MAX WIN: $${data.winAmount.toFixed(2)} 🏆`);
             setCrashed(true); // Game over (win state)
          }
        } else {
          setCrashed(true);
          setResultMsg(`💀 FELL FROM LADDER 💀`);
          setWinnings(0);
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

  const cashOut = () => {
    if (currentStep > 0 && !crashed) {
      setResultMsg(`💸 CASHED OUT: $${winnings.toFixed(2)} 💸`);
      setCrashed(true); // Ends game visually
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setCrashed(false);
    setWinnings(0);
    setResultMsg("");
  };

  return (
    <div className="w-full flex flex-col items-center relative z-10 p-4">
      <div className="text-center mb-6 max-w-sm px-4">
         <p className="text-slate-400 text-sm font-medium tracking-wide leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5 shadow-inner">
           Escala los peldaños. A mayor altura, mayor premio y mayor riesgo de caer.
         </p>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-sm mb-6 items-center">
        {[5, 4, 3, 2, 1].map((lvl) => {
           const isActive = currentStep === lvl && !crashed;
           const isPassed = currentStep >= lvl && ((lvl < currentStep) || (crashed && winnings > 0 && currentStep === 5));
           const isFail = crashed && currentStep === lvl - 1 && winnings === 0;

           let bgColor = "bg-neutral-900 border-white/10";
           if (isActive || isPassed) bgColor = "bg-yellow-500/80 border-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.6)]";
           if (isFail) bgColor = "bg-red-900 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.7)]";

           return (
             <motion.div
               key={lvl}
               animate={{ scale: isActive ? 1.05 : 1 }}
               className={`w-full max-w-xs h-12 flex items-center justify-center border-2 rounded-xl transition-all duration-300 ${bgColor}`}
             >
                <span className={`font-black tracking-widest ${isActive || isPassed ? "text-yellow-100" : "text-neutral-500"}`}>
                   STEP {lvl} ({(1 + lvl * 0.2).toFixed(1)}x)
                </span>
             </motion.div>
           );
        })}
      </div>

      <div className="h-8 mb-4 text-center z-10 relative">
        <AnimatePresence>
        {resultMsg && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            className={`font-black text-lg tracking-widest ${winnings > 0 || resultMsg.includes('CASH') ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,1)]' : 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,1)]'}`}
          >
            {resultMsg}
          </motion.p>
        )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-4 z-10 relative w-full items-center">
        {crashed || currentStep === 5 ? (
          <button
            onClick={reset}
            className="bg-neutral-800 hover:bg-neutral-700 text-yellow-400 font-bold text-xl px-12 py-3 rounded-xl border border-yellow-500/50"
          >
            PLAY AGAIN
          </button>
        ) : (
          <div className="flex gap-4">
             {currentStep > 0 && (
               <button onClick={cashOut} disabled={loading} className="bg-green-600 hover:bg-green-500 text-white font-bold text-lg px-6 py-2 rounded-xl border border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                 CASH OUT
               </button>
             )}
             <button
               onClick={handleClimb}
               disabled={loading || crashed}
               className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-xl px-12 py-3 rounded-xl border border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)] disabled:opacity-50"
             >
               {currentStep === 0 ? "START CLIMB" : "NEXT STEP"}
             </button>
          </div>
        )}
        <BetControls bet={bet} setBet={setBet} loading={loading} sessionProfit={sessionProfit} />
      </div>
    </div>
  );
}
