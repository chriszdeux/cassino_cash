"use client";

import { useState } from "react";
import { useCasinoStore } from "@/lib/store";
import { PlayRequest, PlayResponse } from "@/types/game";
import { playGameLocally } from "@/lib/gameEngine";
import { motion, AnimatePresence } from "framer-motion";
import BetControls from "@/components/ui/BetControls";

export default function PulseMatch({ onPlay }: { onPlay: () => void }) {
  const [bet, setBet] = useState(10);
  const [loading, setLoading] = useState(false);
  const [sessionProfit, setSessionProfit] = useState(0);
  const [resultMsg, setResultMsg] = useState("");
  const [revealed, setRevealed] = useState<number[]>([]);
  const [winningId, setWinningId] = useState<number | null>(null);
  const [pickedId, setPickedId] = useState<number | null>(null);
  const { balance, setBalance } = useCasinoStore();

  const handlePick = async (index: number) => {
    if (loading || revealed.length > 0) return;
    if (bet <= 0 || bet > balance) {
      setResultMsg("Monto de apuesta inválido");
      return;
    }

    setLoading(true);
    setResultMsg("");
    setPickedId(index);

    try {
      const request = { gameId: "pulse-match", betAmount: bet, currentBalance: balance, payload: { cardIndex: index } } as PlayRequest;
      const data: PlayResponse = await playGameLocally(request);

      if (data.success) {
        setWinningId(data.resultData?.winningIndex);
        setRevealed([0, 1, 2]); // Reveal all
        setBalance(data.newBalance);
        setSessionProfit(prev => prev + (data.winAmount - bet));
        onPlay();
        
        if (data.resultData?.outcome === "win") {
          setResultMsg(`🎉 PULSE MATCHED! WON $${data.winAmount}! 🎉`);
        } else {
          setResultMsg("💀 Mismatch. Has perdido 💀");
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

  const reset = () => {
    setRevealed([]);
    setWinningId(null);
    setPickedId(null);
    setResultMsg("");
  };

  return (
    <div className="w-full flex flex-col items-center relative z-10 p-6">
      <div className="text-center mb-6 max-w-sm px-4">
         <p className="text-slate-400 text-sm font-medium tracking-wide leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5 shadow-inner">
           Encuentra la carta oculta ganadora entre las 3 opciones.
         </p>
      </div>
      <div className="flex gap-6 mb-12">
        {[0, 1, 2].map((i) => {
           const isRevealed = revealed.includes(i);
           const isWinner = winningId === i;
           const isPicked = pickedId === i;

           return (
             <motion.div
               key={i}
               onClick={() => handlePick(i)}
               animate={{ rotateY: isRevealed ? 180 : 0, scale: isPicked ? 1.05 : 1 }}
               transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
               className={`w-28 h-40 perspect-1000 cursor-pointer relative ${isRevealed ? "pointer-events-none" : ""}`}
             >
                <div className={`absolute inset-0 backface-hidden rounded-xl border-2 border-cyan-500/50 bg-neutral-900 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center`}>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-12 h-12 rounded-full border border-cyan-400" />
                </div>
                <div 
                   className={`absolute inset-0 backface-hidden origin-center rounded-xl border-4 flex flex-col items-center justify-center p-2
                   ${isWinner ? "border-green-400 bg-green-900 shadow-[0_0_20px_rgba(74,222,128,0.7)]" : "border-red-500 bg-red-950"} 
                   `}
                   style={{ transform: "rotateY(180deg)" }}
                >
                    <span className="text-4xl">{isWinner ? "⚡" : "❌"}</span>
                    {isPicked && <span className="text-xs text-white/50 mt-2">YOUR PICK</span>}
                </div>
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
            className={`font-black text-xl tracking-widest ${resultMsg.includes('WON') ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,1)]' : 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,1)]'}`}
          >
            {resultMsg}
          </motion.p>
        )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-4 z-10 relative">
        {revealed.length > 0 && (
           <button onClick={reset} className="text-cyan-400 hover:text-white underline font-bold tracking-widest">
              PLAY AGAIN
           </button>
        )}
        <BetControls bet={bet} setBet={setBet} loading={loading} sessionProfit={sessionProfit} />
      </div>
    </div>
  );
}
