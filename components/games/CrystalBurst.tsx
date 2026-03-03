"use client";

import { useState } from "react";
import { useCasinoStore } from "@/lib/store";
import { PlayRequest, PlayResponse } from "@/types/game";
import { playGameLocally } from "@/lib/gameEngine";
import { motion } from "framer-motion";
import BetControls from "@/components/ui/BetControls";

export default function CrystalBurst({ onPlay }: { onPlay: () => void }) {
  const [bet, setBet] = useState(10);
  const [loading, setLoading] = useState(false);
  const [sessionProfit, setSessionProfit] = useState(0);
  const [resultMsg, setResultMsg] = useState("");
  const [revealed, setRevealed] = useState<Record<number, string>>({});

  const { balance, setBalance } = useCasinoStore();

  const handlePick = async (index: number) => {
    if (loading || revealed[index] || (Object.keys(revealed).length > 0 && resultMsg)) return;

    if (bet <= 0 || bet > balance) {
      setResultMsg("Monto de apuesta inválido");
      return;
    }

    setLoading(true);
    setResultMsg("");

    try {
      const request = { gameId: "crystal-burst", betAmount: bet, currentBalance: balance } as PlayRequest;
      const data: PlayResponse = await playGameLocally(request);
      
      if (data.success) {
        setBalance(data.newBalance);
        setSessionProfit(prev => prev + (data.winAmount - bet));
        onPlay();
        
        const isWin = data.resultData?.outcome === "win";
        const symbol = isWin ? "💎" : "💣";
        
        setRevealed({ ...revealed, [index]: symbol });

        if (isWin) {
          setResultMsg(`🎉 ¡GANASTE $${data.winAmount}! 🎉`);
        } else {
          setResultMsg("💣 BOOOOM! Has perdido! 💣");
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

  const handleReset = () => {
     setRevealed({});
     setResultMsg("");
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mb-6 max-w-sm px-4">
         <p className="text-slate-400 text-sm font-medium tracking-wide leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5 shadow-inner">
           Busca cristales seguros y acumula multiplicadores. Cuidado con la bomba.
         </p>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6 relative">
        {Array.from({ length: 9 }).map((_, i) => (
           <motion.button
             key={i}
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => handlePick(i)}
             disabled={loading || !!revealed[i] || !!resultMsg}
             className={`w-20 h-20 rounded-xl flex items-center justify-center text-4xl shadow-lg border-[2px] transition-colors
                ${revealed[i] === '💣' ? 'bg-red-900 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.7)]' : 
                  revealed[i] === '💎' ? 'bg-green-900/50 border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.7)]' : 
                  'bg-indigo-950 border-indigo-500/50 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]'}
             `}
           >
              {revealed[i] || "🔮"}
           </motion.button>
        ))}
      </div>

      <div className="h-8 mb-4 text-center">
        {resultMsg && (
          <motion.p 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className={`font-black text-xl tracking-widest ${resultMsg.includes('WON') ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,1)]' : 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,1)]'}`}
          >
            {resultMsg}
          </motion.p>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        {resultMsg && (
           <button onClick={handleReset} className="text-purple-400 hover:text-white font-bold underline mb-2 transition">
             Play Again
           </button>
        )}
        <BetControls bet={bet} setBet={setBet} loading={loading} sessionProfit={sessionProfit} />
      </div>
    </div>
  );
}
