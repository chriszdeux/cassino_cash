"use client";

import { useState } from "react";
import { useCasinoStore } from "@/lib/store";
import { PlayRequest, PlayResponse } from "@/types/game";
import { playGameLocally } from "@/lib/gameEngine";
import { motion, AnimatePresence } from "framer-motion";
import BetControls from "@/components/ui/BetControls";

export default function CyberRoulette({ onPlay }: { onPlay: () => void }) {
  const [bet, setBet] = useState(10);
  const [betType, setBetType] = useState<string>('red');
  const [loading, setLoading] = useState(false);
  const [sessionProfit, setSessionProfit] = useState(0);
  const [resultMsg, setResultMsg] = useState("");
  const [spinningDegrees, setSpinningDegrees] = useState(0);

  const { balance, setBalance } = useCasinoStore();

  const handleSpin = async () => {
    if (bet <= 0 || bet > balance) {
      setResultMsg("Monto de apuesta inválido");
      return;
    }

    setLoading(true);
    setResultMsg("");

    // Simulate huge spin rotation
    const newRotation = spinningDegrees + 360 * 5 + Math.floor(Math.random() * 360);
    setSpinningDegrees(newRotation);

    try {
      const request = { gameId: "cyber-roulette", betAmount: bet, currentBalance: balance, payload: { betType } } as PlayRequest;
      const data: PlayResponse = await playGameLocally(request);
      
      if (data.success) {
        setBalance(data.newBalance);
        setSessionProfit(prev => prev + (data.winAmount - bet));
        onPlay();
        
        const outcome = data.resultData?.outcome;
        setTimeout(() => {
          if (outcome === "win") {
            setResultMsg(`🎉 ¡GANASTE $${data.winAmount}! (Landed on ${data.resultData?.outcomeNumber} ${data.resultData?.outcomeColor}) 🎉`);
          } else {
            setResultMsg(`💀 Has perdido. Landed on ${data.resultData?.outcomeNumber} ${data.resultData?.outcomeColor} 💀`);
          }
        }, 300); // Small delay to let spin finish visually
      } else {
        setResultMsg(data.message || "Error del servidor");
      }
    } catch (e) {
      setResultMsg("Error de red");
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mb-6 max-w-sm px-4">
         <p className="text-slate-400 text-sm font-medium tracking-wide leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5 shadow-inner">
           Ruleta cibernética. Apuesta al rojo, negro, par, impar o verde.
         </p>
      </div>
      <div className="relative w-48 h-48 mb-6 rounded-full border-4 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)] bg-neutral-900 overflow-hidden flex items-center justify-center">
        <motion.div
           animate={{ rotate: spinningDegrees }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           className="w-full h-full rounded-full border-[10px] border-dashed border-white/20"
        >
          {/* Decorative disc inner parts */}
          <div className="absolute inset-0 bg-[conic-gradient(red_25%,black_0_50%,red_0_75%,black_0)] opacity-50 rounded-full" />
        </motion.div>
        
        {/* Center pin overlay */}
        <div className="absolute w-8 h-8 bg-cyan-400 rounded-full shadow-[0_0_15px_cyan] z-10" />
      </div>

      <div className="h-8 mb-4 text-center">
        {resultMsg && (
          <motion.p 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className={`font-black text-lg tracking-widest ${resultMsg.includes('WON') ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,1)]' : 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,1)]'}`}
          >
            {resultMsg}
          </motion.p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
         {['red', 'black', 'even', 'odd', 'green'].map((type) => (
             <button
               key={type}
               onClick={() => setBetType(type)}
               disabled={loading}
               className={`px-4 py-2 rounded-full uppercase text-sm font-bold border transition ${betType === type ? 'bg-cyan-500 border-cyan-300 text-black shadow-[0_0_10px_cyan]' : 'bg-transparent text-gray-400 border-gray-600 hover:border-cyan-500'}`}
             >
                 {type}
             </button>
         ))}
      </div>

      <BetControls bet={bet} setBet={setBet} loading={loading} sessionProfit={sessionProfit} />
      <button 
        onClick={handleSpin} 
        disabled={loading}
        className="mt-4 w-full max-w-[280px] py-3 rounded-lg font-black text-xl uppercase tracking-widest transition-all bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-[0_0_20px_rgba(217,70,239,0.5)] hover:shadow-[0_0_30px_rgba(217,70,239,0.8)] border border-fuchsia-400 disabled:opacity-50 disabled:grayscale"
      >
        {loading ? "GIRANDO..." : "¡GIRAR!"}
      </button>
    </div>
  );
}
