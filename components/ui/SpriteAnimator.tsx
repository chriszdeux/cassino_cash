"use client";

import { useState, useEffect } from "react";

interface SpriteAnimatorProps {
  baseName: string;
  frameCount: number;
  cols: number;
  rows: number;
  fps?: number;
  playing?: boolean;
  className?: string;
  loop?: boolean;
}

export default function SpriteAnimator({ 
  baseName, 
  frameCount, 
  cols,
  rows,
  fps = 30, 
  playing = true, 
  className = "",
  loop = true
}: SpriteAnimatorProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!playing) return;
    
    let currentFrame = 0;
    const interval = setInterval(() => {
      currentFrame++;
      if (currentFrame >= frameCount) {
         if (loop) {
            currentFrame = 0;
         } else {
            currentFrame = frameCount - 1;
            clearInterval(interval);
         }
      }
      setFrame(currentFrame);
    }, 1000 / fps);
    
    return () => clearInterval(interval);
  }, [playing, frameCount, fps, loop]);

  const src = `/sprites/transparent/${baseName}.png`;

  const currentCol = frame % cols;
  const currentRow = Math.floor(frame / cols);
  
  const bgPosX = cols > 1 ? (currentCol / (cols - 1)) * 100 : 0;
  const bgPosY = rows > 1 ? (currentRow / (rows - 1)) * 100 : 0;

  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={{
        backgroundImage: `url('${src}')`,
        backgroundSize: `${cols * 100}% ${rows * 100}%`,
        backgroundPosition: `${bgPosX}% ${bgPosY}%`,
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}
