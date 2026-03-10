"use client";

import { useState, useRef, useEffect } from "react";
import { useCasinoStore } from "@/lib/store";
import { PlayRequest, PlayResponse } from "@/types/game";
import { playGameLocally } from "@/lib/gameEngine";
import { motion, AnimatePresence } from "framer-motion";
import BetControls from "@/components/ui/BetControls";

// standard european roulette numbers order
const ROULETTE_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

function getNumberColor(num: number) {
  if (num === 0) return 'verde';
  if (RED_NUMBERS.includes(num)) return 'rojo';
  return 'negro';
}

type BetType = 'rojo' | 'negro' | 'par' | 'impar' | 'verde';

export default function CyberRoulette({ onPlay }: { onPlay: () => void }) {
  const [bet, setBet] = useState(10);
  const [betType, setBetType] = useState<BetType>('rojo');
  const [loading, setLoading] = useState(false);
  const [sessionProfit, setSessionProfit] = useState(0);
  const [resultMsg, setResultMsg] = useState("");
  const [outcomeStatus, setOutcomeStatus] = useState<"win" | "lose" | null>(null);
  
  const [wheelRotation, setWheelRotation] = useState(0);

  const { balance, setBalance } = useCasinoStore();
  const wheelRef = useRef<HTMLDivElement>(null);

  const handleSpin = async () => {
    if (bet <= 0 || bet > balance) {
      setOutcomeStatus(null);
      setResultMsg("Monto de apuesta inválido");
      return;
    }

    setLoading(true);
    setResultMsg("");
    setOutcomeStatus(null);

    try {
      const request = { gameId: "cyber-roulette", betAmount: bet, currentBalance: balance, payload: { betType } } as PlayRequest;
      const data: PlayResponse = await playGameLocally(request);
      
      if (data.success && data.resultData) {
        
        const outcomeNumber = data.resultData.outcomeNumber;
        const outcomeIndex = ROULETTE_NUMBERS.indexOf(outcomeNumber);
        
        // Calculate degrees to land on the correct number
        const pocketAngle = 360 / 37;
        const targetAngle = 360 - (outcomeIndex * pocketAngle);
        
        // Spin multiple times
        const extraSpins = 360 * 5; 
        const nextRotation = wheelRotation + extraSpins + (targetAngle - (wheelRotation % 360));
        
        setWheelRotation(nextRotation);

        // wait for spin animation
        setTimeout(() => {
          setBalance(data.newBalance);
          setSessionProfit(prev => prev + (data.winAmount - bet));
          onPlay();
          
          const outcome = data.resultData?.outcome;
          setOutcomeStatus(outcome as "win" | "lose");
          
          const colorName = data.resultData?.outcomeColor.toUpperCase();
          if (outcome === "win") {
            setResultMsg(`¡GANASTE $${data.winAmount}! [${outcomeNumber} ${colorName}]`);
          } else {
            setResultMsg(`PERDISTE... [${outcomeNumber} ${colorName}]`);
          }
           setLoading(false);
        }, 4000); // the duration of the spin

      } else {
        setResultMsg(data.message || "Error del servidor");
        setLoading(false);
      }
    } catch (e) {
      setResultMsg("Error de red");
      setLoading(false);
    }
  };

  const betOptions: { id: BetType, label: string, color: string, bg: string }[] = [
    { id: 'rojo', label: 'Rojo (x2)', color: 'text-red-400', bg: 'bg-red-950/50 hover:bg-red-900 border-red-500/50' },
    { id: 'negro', label: 'Negro (x2)', color: 'text-gray-300', bg: 'bg-gray-950/80 hover:bg-gray-800 border-gray-600/50' },
    { id: 'par', label: 'Par (x2)', color: 'text-cyan-400', bg: 'bg-cyan-950/40 hover:bg-cyan-900 border-cyan-500/50' },
    { id: 'impar', label: 'Impar (x2)', color: 'text-fuchsia-400', bg: 'bg-fuchsia-950/40 hover:bg-fuchsia-900 border-fuchsia-500/50' },
    { id: 'verde', label: 'Cero (x??)', color: 'text-emerald-400', bg: 'bg-emerald-950/50 hover:bg-emerald-900 border-emerald-500/50' },
  ];

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-8 py-6 selection:bg-cyan-500/30">
      <div className="text-center md:max-w-xl px-4">
         <div className="inline-flex flex-col items-center">
             <h2 className="text-3xl md:text-5xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-blue-400 to-indigo-600 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)] mb-2 uppercase">Cyber Roulette</h2>
             <div className="h-1 w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_cyan]" />
         </div>
      </div>
      
      {/* ROULETTE WHEEL */}
      <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full p-2 bg-gradient-to-br from-slate-900 via-black to-slate-900 border-[6px] border-[#0c162d] shadow-[0_0_50px_rgba(6,182,212,0.15),inset_0_0_30px_rgba(0,0,0,1)] flex items-center justify-center">
        {/* Outer Glow */}
        <div className="absolute -inset-2 rounded-full border border-cyan-500/30 blur-sm pointer-events-none" />
        
        {/* Main Wheel Container */}
        <motion.div
           ref={wheelRef}
           animate={{ rotate: wheelRotation }}
           transition={{ duration: 4, type: "tween", ease: [0.2, 0.8, 0.1, 1] }} 
           className="relative w-full h-full rounded-full overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]"
        >
          {ROULETTE_NUMBERS.map((num, i) => {
            const angle = i * (360 / 37);
            const colorClass = num === 0 ? "text-emerald-400 bg-emerald-900" : (RED_NUMBERS.includes(num) ? "text-white bg-red-700" : "text-white bg-slate-900");
            
            return (
              <div 
                key={num} 
                className="absolute w-[20px] h-[50%] left-1/2 bottom-1/2 origin-bottom flex justify-center pt-2"
                style={{
                  transform: `translateX(-50%) rotate(${angle}deg)`,
                }}
              >
                  {/* The pocket background slice */}
                  <div className="absolute top-0 w-8 h-24 -ml-4 origin-bottom clip-roulette-slice" style={{ transform: `rotate(0deg)`}}>
                    <div className={`w-full h-full ${colorClass} border-x border-[#ffffff10] shadow-inner`} />
                  </div>
                  
                  {/* The number text */}
                  <span className="relative z-10 text-[10px] md:text-sm font-black tracking-tighter" style={{ transform: 'rotate(-90deg)', marginTop: '4px' }}>
                     {num}
                  </span>
              </div>
            );
          })}
          
          {/* Inner metallic circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-gray-700 via-gray-900 to-black border-4 border-[#1a2b4c] shadow-[0_0_20px_rgba(0,0,0,1),inset_0_0_15px_rgba(255,255,255,0.1)] flex items-center justify-center z-20">
             <div className="w-1/3 h-1/3 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-400 via-orange-600 to-yellow-700 shadow-[0_0_15px_rgba(234,179,8,0.5)] flex items-center justify-center">
                 <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_5px_white]" />
             </div>
          </div>
        </motion.div>
        
        {/* Center Pointer / Ball mark */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-6 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,1)] z-30 pointer-events-none flex flex-col items-center">
           <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_15px_white,inset_0_0_5px_black] animate-pulse" />
           <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white mix-blend-screen" />
        </div>
      </div>

      <div className="h-12 flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          {resultMsg && (
            <motion.div 
              key={resultMsg}
              initial={{ opacity: 0, y: 10, scale: 0.9 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: -10 }}
              className={`px-6 py-2 rounded-full border font-black text-sm md:text-lg tracking-widest backdrop-blur-md shadow-lg ${
                 outcomeStatus === "win" 
                  ? 'bg-green-500/10 border-green-500/50 text-green-400 shadow-[0_0_20px_rgba(74,222,128,0.3)]' 
                  : outcomeStatus === "lose" 
                     ? 'bg-red-500/10 border-red-500/50 text-red-500'
                     : 'bg-white/5 border-white/20 text-white'
              }`}
            >
              {resultMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BETTING TABLE */}
      <div className="w-full max-w-2xl bg-black/40 p-4 md:p-6 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col items-center gap-6">
          <div className="w-full flex flex-wrap justify-center gap-3">
             {betOptions.map((opt) => (
                 <button
                   key={opt.id}
                   onClick={() => setBetType(opt.id)}
                   disabled={loading}
                   className={`
                      relative overflow-hidden px-4 md:px-6 py-3 rounded-xl border-2 uppercase text-xs md:text-sm font-black tracking-wider transition-all duration-300
                      ${betType === opt.id 
                         ? `border-white ${opt.bg.split(' ')[0]} shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105` 
                         : `${opt.bg} opacity-70 hover:opacity-100 hover:scale-105`}
                      disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed
                   `}
                 >
                     <span className={`relative z-10 ${opt.color} drop-shadow-md`}>{opt.label}</span>
                     {betType === opt.id && (
                        <motion.div layoutId="bet-outline" className="absolute inset-0 border-2 border-white rounded-xl" transition={{ type: "spring", stiffness: 300, damping: 20 }} />
                     )}
                 </button>
             ))}
          </div>

          <div className="w-full space-y-4">
             <BetControls bet={bet} setBet={setBet} loading={loading} sessionProfit={sessionProfit} />
             <div className="w-full flex justify-center">
                 <button 
                   onClick={handleSpin} 
                   disabled={loading}
                   className="group relative w-full max-w-xs py-4 rounded-xl font-black text-xl md:text-2xl uppercase tracking-widest transition-all bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white border-2 border-cyan-300/50 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.8)] disabled:opacity-50 disabled:grayscale overflow-hidden"
                 >
                   <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                   <span className="relative z-10 flex items-center justify-center gap-3">
                      {loading ? (
                         <>
                            <span className="animate-spin text-2xl">🌀</span>
                            GIRANDO...
                         </>
                      ) : (
                         <>
                            <span className="text-2xl group-hover:rotate-180 transition-transform duration-500">🎡</span>
                            GIRAR RULETA
                         </>
                      )}
                   </span>
                 </button>
             </div>
          </div>
      </div>
      
      {/* Required tailwind utilities for the custom shape */}
      {/* We add a style tag to define custom clip-path for slices if needed, or simply use tailwind utilities */}
      <style dangerouslySetInnerHTML={{__html: `
        .clip-roulette-slice {
          clip-path: polygon(50% 100%, 0 0, 100% 0);
        }
      `}} />
    </div>
  );
}
