"use client";

import { useState } from "react";
import { useCasinoStore } from "@/lib/store";
import { PlayRequest, PlayResponse } from "@/types/game";
import { playGameLocally } from "@/lib/gameEngine";
import { motion, AnimatePresence } from "framer-motion";
import BetControls from "@/components/ui/BetControls";

export default function OrbMiner({ onPlay }: { onPlay: () => void }) {
  const [bet, setBet] = useState(10);
  const [loading, setLoading] = useState(false);
  const [sessionProfit, setSessionProfit] = useState(0);
  const [resultMsg, setResultMsg] = useState("");
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [outcomeStatus, setOutcomeStatus] = useState<"win" | "lose" | null>(null);
  const { balance, setBalance } = useCasinoStore();

  const handleDig = async (coord: number) => {
    if (loading || outcomeStatus !== null || revealed[coord]) return;
    if (bet <= 0 || bet > balance) {
      setResultMsg("Monto de apuesta inválido");
      return;
    }

    setLoading(true);
    setResultMsg("");

    try {
      const request = { gameId: "orb-miner", betAmount: bet, currentBalance: balance, payload: { coord } } as PlayRequest;
      const data: PlayResponse = await playGameLocally(request);

      if (data.success) {
        setBalance(data.newBalance);
        setSessionProfit(prev => prev + (data.winAmount - bet));
        onPlay();
        
        if (data.resultData?.outcome === "win") {
          setRevealed({ ...revealed, [coord]: true });
          setResultMsg(`🎉 FOUND ORB! WON $${data.winAmount.toFixed(2)} 🎉`);
          setOutcomeStatus("win");
        } else {
          setRevealed({ ...revealed, [coord]: false });
          setOutcomeStatus("lose");
          setResultMsg("💥 YOU HIT A CRATER 💥");
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
    setRevealed({});
    setOutcomeStatus(null);
    setResultMsg("");
  };

  return (
    <div className="w-full flex flex-col items-center relative z-10 p-6">
      <div className="text-center mb-6 max-w-sm px-4">
         <p className="text-slate-400 text-sm font-medium tracking-wide leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5 shadow-inner">
           Selecciona una coordenada del cristal cuántico y busca el premio.
         </p>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-12">
        {Array.from({ length: 9 }).map((_, coord) => {
           const isRevealed = revealed[coord] !== undefined;
           const isSuccess = revealed[coord] === true;

           return (
             <motion.div
               key={coord}
               onClick={() => handleDig(coord)}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               animate={{ rotateY: isRevealed ? 180 : 0 }}
               transition={{ duration: 0.6 }}
               className={`w-24 h-24 perspect-1000 cursor-pointer relative ${isRevealed ? "pointer-events-none" : "hover:shadow-[0_0_15px_rgba(251,191,36,0.3)]"} rounded-xl`}
             >
                <div className="absolute inset-0 backface-hidden rounded-xl bg-orange-950 border-2 border-yellow-600/50 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 rounded-full border border-yellow-700/50 bg-black/40 shadow-inner" />
                </div>
                <div 
                   className={`absolute inset-0 backface-hidden origin-center rounded-xl flex items-center justify-center
                   ${isSuccess ? "bg-yellow-400 border-4 border-white shadow-[0_0_30px_rgba(253,224,71,0.8)]" : "bg-neutral-800 border-2 border-red-500"} 
                   `}
                   style={{ transform: "rotateY(180deg)" }}
                >
                    <span className="text-4xl drop-shadow-md">{isSuccess ? "🟡" : "🕳️"}</span>
                </div>
             </motion.div>
           );
        })}
      </div>

      <div className="h-8 mb-4 text-center z-10 relative">
        <AnimatePresence>
        {resultMsg && (
          <motion.p 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0 }}
            className={`font-black text-xl tracking-widest ${outcomeStatus === "win" ? 'text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,1)]' : 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,1)]'}`}
          >
            {resultMsg}
          </motion.p>
        )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-4 z-10 relative">
        {outcomeStatus && (
           <button onClick={reset} className="text-yellow-400 hover:text-white font-bold underline mb-2 tracking-widest">
              MINE AGAIN
           </button>
        )}
        <BetControls bet={bet} setBet={setBet} loading={loading} sessionProfit={sessionProfit} />
      </div>
    </div>
  );
}
