"use client";

import { Coins, TrendingUp, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BetControlsProps {
  bet: number;
  setBet: (val: number) => void;
  loading: boolean;
  minBet?: number;
  sessionProfit?: number;
}

export default function BetControls({ bet, setBet, loading, minBet = 10, sessionProfit }: BetControlsProps) {
  const suggestions = [10, 100, 300, 500];

  return (
    <div className="flex flex-col gap-3 w-full mt-2 max-w-[280px]">
       {sessionProfit !== undefined && (
          <div className={`flex justify-between items-center bg-black/80 px-4 py-2 rounded-xl mb-1 shadow-inner border ${sessionProfit >= 0 ? 'border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 'border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]'}`}>
             <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
               Balance Sesión
             </span>
             <AnimatePresence mode="popLayout">
                <motion.span 
                   key={sessionProfit}
                   initial={{ y: -10, opacity: 0, scale: 0.5 }}
                   animate={{ y: 0, opacity: 1, scale: 1 }}
                   exit={{ y: 10, opacity: 0, scale: 0.5 }}
                   transition={{ type: "spring", stiffness: 300, damping: 25 }}
                   className={`font-black tracking-widest text-lg flex items-center gap-1 transition-colors ${sessionProfit > 0 ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]' : sessionProfit < 0 ? 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]' : 'text-gray-500'}`}
                >
                   {sessionProfit > 0 ? <TrendingUp size={16} /> : sessionProfit < 0 ? <TrendingDown size={16} /> : null}
                   {sessionProfit > 0 ? "+" : ""}{sessionProfit} G
                </motion.span>
             </AnimatePresence>
          </div>
       )}
       <div className="grid grid-cols-4 gap-2 w-full">
         {suggestions.map(val => (
           <motion.button 
             key={val} 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => setBet(val)} 
             disabled={loading}
             className={`relative overflow-hidden group ${bet === val ? 'bg-fuchsia-800 border-fuchsia-400 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]' : 'bg-black/80 hover:bg-fuchsia-900/50 border-fuchsia-500/30 text-fuchsia-300 shadow-[0_0_10px_rgba(217,70,239,0.1)] hover:shadow-[0_0_15px_rgba(217,70,239,0.4)]'} border py-1.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center`}
           >
             <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-diamond-shine mix-blend-overlay opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity pointer-events-none" />
             <AnimatePresence>
                {bet === val && (
                   <motion.span 
                      initial={{ scale: 0, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute left-1 text-[10px] drop-shadow-[0_0_4px_white] animate-pulse"
                   >💎</motion.span>
                )}
             </AnimatePresence>
             <span className="relative z-10">${val}</span>
             <AnimatePresence>
                {bet === val && (
                   <motion.span 
                      initial={{ scale: 0, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute right-1 text-[10px] drop-shadow-[0_0_4px_white] animate-pulse"
                   >💎</motion.span>
                )}
             </AnimatePresence>
           </motion.button>
         ))}
       </div>
       <div className="flex items-center justify-between bg-black/90 px-4 py-3 rounded-xl border border-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,239,0.2)]">
          <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
             <Coins className="w-4 h-4 text-fuchsia-400" /> APUESTA:
          </label>
          <input 
            type="number" 
            disabled={loading}
            value={bet || ""} 
            onChange={(e) => setBet(Number(e.target.value))} 
            className="w-28 bg-transparent text-white font-black outline-none text-right pr-2 text-2xl placeholder-white/20"
            placeholder="0"
            min={minBet}
          />
       </div>
    </div>
  );
}
