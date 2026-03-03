"use client";

import { Coins, TrendingUp, TrendingDown } from "lucide-react";

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
             <span className={`text-lg font-black tracking-widest flex items-center gap-1 ${sessionProfit > 0 ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]' : sessionProfit < 0 ? 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]' : 'text-gray-500'}`}>
                {sessionProfit > 0 ? <TrendingUp size={16} /> : sessionProfit < 0 ? <TrendingDown size={16} /> : null}
                {sessionProfit > 0 ? "+" : ""}{sessionProfit} G
             </span>
          </div>
       )}
       <div className="grid grid-cols-4 gap-2 w-full">
         {suggestions.map(val => (
           <button 
             key={val} 
             onClick={() => setBet(val)} 
             disabled={loading}
             className="bg-black/80 hover:bg-fuchsia-900/50 border border-fuchsia-500/30 hover:border-fuchsia-400 py-1.5 rounded-lg text-fuchsia-300 hover:text-white font-bold text-sm transition-all shadow-[0_0_10px_rgba(217,70,239,0.1)] hover:shadow-[0_0_15px_rgba(217,70,239,0.4)] disabled:opacity-50"
           >
             ${val}
           </button>
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
