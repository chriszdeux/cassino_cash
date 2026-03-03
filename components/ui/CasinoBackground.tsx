"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function CasinoBackground() {
  const [elements, setElements] = useState<any[]>([]);
  const [coins, setCoins] = useState<any[]>([]);

  useEffect(() => {
    // Generate random background elements (cards, chips)
    const shapes = ['♦', '♣', '♥', '♠', '🪙'];
    const colors = ['text-red-500', 'text-slate-500', 'text-red-500', 'text-slate-500', 'text-yellow-500'];
    
    const newElements = Array.from({ length: 25 }).map((_, i) => {
      const shapeIdx = Math.floor(Math.random() * shapes.length);
      return {
        id: i,
        shape: shapes[shapeIdx],
        color: colors[shapeIdx],
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 15 + Math.random() * 20,
        scale: 0.5 + Math.random() * 1.5,
        opacity: 0.05 + Math.random() * 0.15
      };
    });

    const rainCoins = Array.from({ length: 15 }).map((_, i) => ({
        id: `coin-${i}`,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 10,
        scale: 0.8 + Math.random() * 1,
        opacity: 0.2 + Math.random() * 0.4
    }));

    const t = setTimeout(() => {
      setElements(newElements);
      setCoins(rainCoins);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#050510]">
      {/* City Background Map/Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a2a] via-[#050510] to-[#010103] opacity-80" />
      <div className="absolute bottom-0 w-full h-1/2 bg-cyan-900/10 mix-blend-color-dodge opacity-40 border-t border-fuchsia-500/10 blur-[80px] animate-pulse" />
      
      {/* Grid lines moving */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] perspective-500"
           style={{ transform: "rotateX(60deg) translateY(-100px) scale(2)", transformOrigin: "top" }} 
      />

      {/* Floating Elements */}
      {elements.map((el) => (
        <motion.div
          key={el.id}
          initial={{ y: "110vh", x: 0, rotate: 0 }}
          animate={{ 
            y: "-10vh", 
            x: Math.sin(el.id) * 100, // sway
            rotate: 360 
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          className={`absolute text-6xl font-black blur-[1px] ${el.color}`}
          style={{ left: `${el.left}%`, scale: el.scale, opacity: el.opacity }}
        >
          {el.shape}
        </motion.div>
      ))}

      {/* Rain of Coins Falling Down */}
      {coins.map((coin) => (
        <motion.div
          key={coin.id}
          initial={{ y: "-15vh", x: 0, rotate: 0 }}
          animate={{ 
            y: "115vh", 
            x: Math.sin(parseInt(coin.id.split('-')[1])) * 50, // sway
            rotate: 360 
          }}
          transition={{
            duration: coin.duration,
            delay: coin.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute text-5xl font-black blur-[1px] text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]"
          style={{ left: `${coin.left}%`, scale: coin.scale, opacity: coin.opacity }}
        >
          🪙
        </motion.div>
      ))}
      
      {/* Neon Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} 
        transition={{ duration: 8, repeat: Infinity }} 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[120px]" 
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.15, 0.1] }} 
        transition={{ duration: 12, repeat: Infinity }} 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px]" 
      />
    </div>
  );
}
