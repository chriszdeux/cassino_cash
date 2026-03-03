"use client";

import { useState } from "react";
import { useCasinoStore } from "@/lib/store";
import { PlayRequest, PlayResponse } from "@/types/game";
import { playGameLocally } from "@/lib/gameEngine";
import { motion } from "framer-motion";
import BetControls from "@/components/ui/BetControls";

export default function NeonSlots({ onPlay }: { onPlay: () => void }) {
  const [bet, setBet] = useState(10);
  const [loading, setLoading] = useState(false);
  const [sessionProfit, setSessionProfit] = useState(0);
  const [reels, setReels] = useState(["❔", "❔", "❔"]);
  const [resultMsg, setResultMsg] = useState("");
  const { balance, setBalance } = useCasinoStore();

  const handleSpin = async () => {
    if (bet <= 0 || bet > balance) {
      setResultMsg("Monto de apuesta inválido");
      return;
    }

    setLoading(true);
    setResultMsg("");

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
      const data: PlayResponse = await playGameLocally(request);
      
      clearInterval(spinInterval);

      if (data.success) {
        setReels(data.resultData?.symbols || ["❌", "❌", "❌"]);
        setBalance(data.newBalance);
        setSessionProfit(prev => prev + (data.winAmount - bet));
        onPlay();
        
        if (data.winAmount > 0) {
          setResultMsg(`🎉 ¡GANASTE $${data.winAmount}! 🎉`);
        } else {
          setResultMsg("💀 Has perdido 💀");
        }
      } else {
        setResultMsg(data.message || "Error del servidor");
      }
    } catch (e) {
      clearInterval(spinInterval);
      setResultMsg("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mb-6 max-w-sm px-4">
         <p className="text-slate-400 text-sm font-medium tracking-wide leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5 shadow-inner">
           Gira los rodillos. Consigue 2 o 3 símbolos iguales para multiplicar tu apuesta.
         </p>
      </div>
      <div className="flex gap-4 mb-8 bg-black/40 p-6 rounded-2xl border border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.2)]">
        {reels.map((symbol, i) => (
          <motion.div
            key={i}
            animate={{ y: loading ? [0, -20, 0] : 0 }}
            transition={{ repeat: loading ? Infinity : 0, duration: 0.2 }}
            className="w-24 h-24 bg-neutral-900 border-2 border-pink-500/50 rounded-xl flex items-center justify-center text-5xl shadow-inner font-mono"
          >
            {symbol}
          </motion.div>
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
