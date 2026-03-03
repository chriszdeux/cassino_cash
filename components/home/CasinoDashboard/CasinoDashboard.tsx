"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameConfig } from "@/types/game";
import { Home, User, Shield, HelpCircle, Lock, Trophy, Minus, X } from "lucide-react";
import { useCasinoStore } from "@/lib/store";
import NeonSlots from "@/components/games/NeonSlots";
import CyberRoulette from "@/components/games/CyberRoulette";
import CrystalBurst from "@/components/games/CrystalBurst";
import BinaryFlip from "@/components/games/BinaryFlip";
import TurboDice from "@/components/games/TurboDice";
import VoidCrash from "@/components/games/VoidCrash";
import PulseMatch from "@/components/games/PulseMatch";
import QuickLadder from "@/components/games/QuickLadder";
import OrbMiner from "@/components/games/OrbMiner";
import SignalGuess from "@/components/games/SignalGuess";
import CasinoBackground from "@/components/ui/CasinoBackground";
import AuthPanel from "@/components/ui/AuthPanel";

const GAMES: GameConfig[] = [
  { id: 'neon-slots', name: 'Neon Slots', description: 'Tragamonedas clásico.', theme: 'from-pink-500 to-purple-600' },
  { id: 'cyber-roulette', name: 'Cyber Roulette', description: 'Ruleta cibernética de color.', theme: 'from-blue-500 to-cyan-400' },
  { id: 'crystal-burst', name: 'Crystal Burst', description: 'Busca el cristal seguro.', theme: 'from-purple-400 to-indigo-600' },
  { id: 'quick-ladder', name: 'Quick Ladder', description: 'Escala premios sin caer.', theme: 'from-yellow-400 to-amber-600' },
  { id: 'binary-flip', name: 'Binary Flip', description: 'Adivina cara o cruz.', theme: 'from-green-400 to-emerald-600' },
  { id: 'orb-miner', name: 'Orbit Miner', description: 'Minería cuántica en 3x3.', theme: 'from-amber-300 to-yellow-500' },
  { id: 'pulse-match', name: 'Pulse Match', description: 'Encuentra la carta ganadora.', theme: 'from-teal-400 to-blue-500' },
  { id: 'void-crash', name: 'Void Crash', description: 'Evita la explosión del vacío.', theme: 'from-slate-700 to-indigo-900' },
  { id: 'turbo-dice', name: 'Turbo Dice', description: 'Lanza los dados de neón.', theme: 'from-red-500 to-orange-500' },
  { id: 'signal-guess', name: 'Signal Guess', description: 'Adivina la próxima señal.', theme: 'from-fuchsia-500 to-pink-500' }
];

const STATIC_STARS = [
  { left: "12%", top: "34%", duration: "2.1s", delay: "0.2s" }, { left: "85%", top: "15%", duration: "1.8s", delay: "1.1s" },
  { left: "45%", top: "78%", duration: "2.5s", delay: "0.5s" }, { left: "22%", top: "50%", duration: "2.0s", delay: "1.5s" },
  { left: "67%", top: "89%", duration: "1.6s", delay: "0.8s" }, { left: "91%", top: "42%", duration: "2.3s", delay: "1.2s" },
  { left: "5%", top: "8%", duration: "1.9s", delay: "0.3s" }, { left: "33%", top: "65%", duration: "2.7s", delay: "1.7s" },
  { left: "55%", top: "25%", duration: "1.5s", delay: "0.9s" }, { left: "74%", top: "95%", duration: "2.2s", delay: "1.4s" },
  { left: "18%", top: "82%", duration: "2.8s", delay: "0.6s" }, { left: "95%", top: "71%", duration: "1.7s", delay: "1.9s" },
  { left: "41%", top: "11%", duration: "2.4s", delay: "0.4s" }, { left: "62%", top: "58%", duration: "2.1s", delay: "1.8s" },
  { left: "8%", top: "54%", duration: "1.9s", delay: "0.7s" }, { left: "88%", top: "29%", duration: "2.6s", delay: "1.3s" },
  { left: "27%", top: "39%", duration: "1.8s", delay: "0.1s" }, { left: "51%", top: "92%", duration: "2.3s", delay: "1.6s" },
  { left: "79%", top: "48%", duration: "2.0s", delay: "0.8s" }, { left: "15%", top: "96%", duration: "2.5s", delay: "1.2s" },
  { left: "37%", top: "21%", duration: "1.6s", delay: "0.5s" }, { left: "98%", top: "85%", duration: "2.7s", delay: "1.0s" },
  { left: "48%", top: "68%", duration: "1.9s", delay: "1.4s" }, { left: "69%", top: "18%", duration: "2.2s", delay: "0.3s" },
  { left: "2%", top: "74%", duration: "2.4s", delay: "1.7s" }, { left: "82%", top: "62%", duration: "1.5s", delay: "0.9s" },
  { left: "31%", top: "91%", duration: "2.8s", delay: "1.5s" }, { left: "59%", top: "37%", duration: "1.7s", delay: "0.2s" },
  { left: "24%", top: "14%", duration: "2.1s", delay: "1.1s" }, { left: "72%", top: "79%", duration: "2.6s", delay: "0.6s" }
];

export default function CasinoDashboard() {
  const [selectedGame, setSelectedGame] = useState<GameConfig | null>(null);
  const [activeTab, setActiveTab] = useState("Sala");
  const { balance, user } = useCasinoStore();

  useEffect(() => {
    if (!user) return;
    
    // Auto-save balance every 5 minutes
    const interval = setInterval(() => {
      console.log("Auto-saving balance...");
      fetch("/api/user/save-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, balance })
      }).catch(err => console.error("Error auto-guardando balance", err));
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, balance]);

  return (
    <div className="min-h-screen w-full bg-[#050510] text-cyan-50 font-mono relative overflow-hidden flex items-stretch p-2 md:p-6 gap-6 selection:bg-fuchsia-500/30">
      <CasinoBackground />
      
      {user ? (
        <>
          {/* LEFT COLUMN */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
            className="hidden lg:flex flex-col gap-4 w-[280px] z-10"
          >
            <SidebarMenu activeTab={activeTab} onTabChange={setActiveTab} />
          </motion.div>

          {/* CENTER COLUMN */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 flex flex-col gap-4 z-10 min-w-0 h-full"
          >
            <NeonTitle />

            {activeTab === "Sala" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-grow flex flex-col min-h-0">
                <WindowPanel title="SALA DE JUEGOS" controls={true} className="flex-grow shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 gap-y-12 place-items-center h-full auto-rows-max overflow-y-auto p-4 pb-20 scrollbar-hide">
                    {GAMES.map((game) => (
                       <GameBubble key={game.id} game={game} onSelect={setSelectedGame} />
                    ))}
                  </div>
                </WindowPanel>
              </motion.div>
            )}

            {activeTab === "Perfil" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-grow flex flex-col min-h-0">
                <FullProfilePanel user={user} balance={balance} />
              </motion.div>
            )}

            {activeTab === "Seguridad" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-grow flex flex-col min-h-0">
                <SecurityPanel />
              </motion.div>
            )}

            {activeTab === "Ayuda" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-grow flex flex-col min-h-0">
                <HelpPanel />
              </motion.div>
            )}
          </motion.div>

          {/* RIGHT COLUMN */}
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden xl:flex flex-col gap-4 w-[320px] z-10 h-full"
            >
              <UserProfilePanel balance={balance} username={user.username} userId={user.id} />
              <RecentActivityPanel username={user.username} />
              <HighScoresPanel />
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 z-10 w-full h-full max-w-5xl mx-auto py-10 overflow-y-auto">
          <NeonTitle />

          <div className="w-full flex flex-col lg:flex-row gap-8 items-stretch justify-center">
            {/* Left: AuthPanel */}
            <div className="flex-1 w-full min-w-0 flex flex-col">
              <AuthPanel />
            </div>

            {/* Right: Enhanced Banner */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 w-full min-w-0 bg-gradient-to-br from-fuchsia-900/60 via-purple-900/50 to-cyan-900/60 border-2 border-fuchsia-500/80 p-8 rounded-xl flex flex-col items-center justify-center gap-6 shadow-[0_0_40px_rgba(217,70,239,0.5)] relative overflow-hidden backdrop-blur-md"
            >
               {/* Enhanced Canvas/Stars effect */}
               <div className="absolute inset-0 overflow-hidden pointer-events-none">
                 {STATIC_STARS.map((star, i) => (
                   <div 
                     key={i} 
                     className="absolute w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,1)]" 
                     style={{
                       left: star.left,
                       top: star.top,
                       animationDuration: star.duration,
                       animationDelay: star.delay
                     }}
                   />
                 ))}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-screen" />
                 
                 {/* Animated circles/canvas */}
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                   className="absolute -right-20 -top-20 w-80 h-80 border border-fuchsia-500/30 rounded-full border-dashed"
                 />
                 <motion.div 
                   animate={{ rotate: -360 }}
                   transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                   className="absolute -left-10 -bottom-10 w-64 h-64 border border-cyan-500/30 rounded-full border-dashed"
                 />
               </div>
               
               <div className="flex flex-col relative z-10 text-center">
                 <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,1)] tracking-widest uppercase mb-4">
                   ¡ÚLTIMA OFERTA ESTELAR! 🚀
                 </h2>
                 <p className="text-cyan-100 text-lg md:text-xl font-bold max-w-md mx-auto mt-2 tracking-wider leading-relaxed">
                   Regístrate hoy mismo y recibe de inmediato <br />
                   <span className="text-yellow-400 font-black text-3xl md:text-4xl drop-shadow-[0_0_10px_rgba(250,204,21,1)]">1,000 CRÉDITOS G</span> <br />
                   para jugar nuestros minijuegos cuánticos.
                 </p>
               </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* GAME MODAL Overlay */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 lg:p-12 pl-20 lg:pl-[200px]"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              className="relative w-full max-w-5xl h-full max-h-[90vh]"
            >
              <WindowPanel 
                title={`JUGANDO: ${selectedGame.name.toUpperCase()}`} 
                controls={true} 
                onClose={() => setSelectedGame(null)} 
                className="h-full border-fuchsia-500 shadow-[0_0_50px_rgba(217,70,239,0.3)] bg-[#050510]/95 backdrop-blur-3xl"
              >
                <div className="w-full h-full flex flex-col items-center justify-center rounded-sm relative overflow-y-auto pb-16 lg:pb-0">
                   <div className={`absolute inset-0 bg-gradient-to-tr ${selectedGame.theme} opacity-5 blur-3xl pointer-events-none`} />
                   
                   <div className="relative z-10 w-full min-h-full flex items-center justify-center p-4">
                     {selectedGame.id === 'neon-slots' ? (
                       <NeonSlots onPlay={() => {}} />
                     ) : selectedGame.id === 'cyber-roulette' ? (
                       <CyberRoulette onPlay={() => {}} />
                     ) : selectedGame.id === 'crystal-burst' ? (
                       <CrystalBurst onPlay={() => {}} />
                     ) : selectedGame.id === 'binary-flip' ? (
                       <BinaryFlip onPlay={() => {}} />
                     ) : selectedGame.id === 'turbo-dice' ? (
                       <TurboDice onPlay={() => {}} />
                     ) : selectedGame.id === 'void-crash' ? (
                       <VoidCrash onPlay={() => {}} />
                     ) : selectedGame.id === 'pulse-match' ? (
                       <PulseMatch onPlay={() => {}} />
                     ) : selectedGame.id === 'quick-ladder' ? (
                       <QuickLadder onPlay={() => {}} />
                     ) : selectedGame.id === 'orb-miner' ? (
                       <OrbMiner onPlay={() => {}} />
                     ) : selectedGame.id === 'signal-guess' ? (
                       <SignalGuess onPlay={() => {}} />
                     ) : (
                       <span className="text-white/30 flex justify-center text-lg font-medium tracking-widest uppercase">
                         Cargando lógica del juego...
                       </span>
                     )}
                   </div>
                </div>
              </WindowPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileNavbar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

// -------------------------------------------------------------
// SUB-COMPONENTS for Window & Layout
// -------------------------------------------------------------

interface WindowPanelProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  controls?: boolean;
  onClose?: () => void;
}

function WindowPanel({ title, children, className = "", controls = false, onClose }: WindowPanelProps) {
  return (
    <div className={`border-[1.5px] border-cyan-800/80 bg-[#060a16]/95 rounded-md flex flex-col overflow-hidden ${className}`}>
      {title && (
        <div className="bg-[#0a152e] border-b border-cyan-800/80 px-4 py-2 flex justify-between items-center text-white">
          <span className="font-bold tracking-widest text-sm drop-shadow-md">{title}</span>
          {controls && (
            <div className="flex gap-2">
              <button className="text-cyan-600 hover:text-white bg-black/50 px-2 py-0.5 rounded-sm border border-cyan-900 transition-colors"><Minus size={14} strokeWidth={3} /></button>
              <button onClick={onClose} className="text-red-500 hover:text-white bg-black/50 px-2 py-0.5 rounded-sm border border-red-900 transition-colors"><X size={14} strokeWidth={3} /></button>
            </div>
          )}
        </div>
      )}
      <div className="w-full flex-grow relative overflow-hidden">
        {children}
      </div>
    </div>
  )
}

function SidebarMenu({ activeTab, onTabChange }: { activeTab: string, onTabChange: (t: string) => void }) {
  const menu = [
    { icon: Home, label: "Sala" },
    { icon: User, label: "Perfil" },
    { icon: Shield, label: "Seguridad" },
    { icon: HelpCircle, label: "Ayuda" }
  ];
  return (
    <div className="border-[1.5px] border-slate-700/80 rounded-md bg-[#0a1020]/90 flex flex-col py-2 flex-grow h-full overflow-hidden">
      {menu.map((m, i) => {
        const isActive = activeTab === m.label;
        return (
          <button key={i} onClick={() => onTabChange(m.label)} className={`flex items-center gap-3 px-6 py-3.5 text-sm font-bold transition-all ${isActive ? 'bg-[#153443]/80 text-cyan-300 border-l-[6px] border-cyan-400 shadow-[inset_0_0_20px_rgba(34,211,238,0.2)]' : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-[6px] border-transparent'}`}>
            <m.icon size={20} className={isActive ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : ""} />
            <span className="tracking-wider">{m.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function MobileNavbar({ activeTab, onTabChange }: { activeTab: string, onTabChange: (t: string) => void }) {
  const { user } = useCasinoStore();
  
  if (!user) return null;

  const menu = [
    { icon: Home, label: "Sala" },
    { icon: User, label: "Perfil" },
    { icon: Shield, label: "Seguridad" },
    { icon: HelpCircle, label: "Ayuda" }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a1020]/95 border-t border-cyan-800/80 backdrop-blur-md z-[60] flex justify-around items-center p-2 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
      {menu.map((m, i) => {
        const isActive = activeTab === m.label || (m.label === 'Seguridad' && activeTab === 'Seguro');
        return (
          <button key={i} onClick={() => onTabChange(m.label)} className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}>
            <m.icon size={20} className={isActive ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : ""} />
            <span className="text-[10px] font-bold tracking-wider">{m.label === 'Seguridad' ? 'Seguro' : m.label}</span>
          </button>
        )
      })}
    </div>
  )
}

interface FullProfilePanelProps {
  user: { username: string; email: string };
  balance: number;
}

function FullProfilePanel({ user, balance }: FullProfilePanelProps) {
  return (
    <WindowPanel title="TU PERFIL ESTELAR" className="flex-grow shadow-[0_0_30px_rgba(147,197,253,0.15)] overflow-y-auto">
      <div className="flex flex-col md:flex-row items-center justify-center p-8 gap-10 h-full">
        <div className="relative">
           <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
           <div className="w-32 h-32 bg-[#151b2d] rounded-full border-4 border-blue-600 flex items-center justify-center text-7xl shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden">
             🤷‍♂️
           </div>
        </div>
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h2 className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] uppercase">
            {user.username}
          </h2>
          <span className="text-blue-300 font-bold tracking-widest">{user.email}</span>
          <div className="mt-4 flex flex-col gap-1">
             <span className="text-slate-400 text-xs tracking-widest uppercase">Balance Cuántico</span>
             <AnimatedBalance balance={balance} />
          </div>
        </div>
      </div>
    </WindowPanel>
  )
}

function SecurityPanel() {
  return (
    <WindowPanel title="CENTRO DE SEGURIDAD" className="flex-grow shadow-[0_0_30px_rgba(16,185,129,0.15)] overflow-y-auto p-6 md:p-10">
       <div className="flex flex-col items-center justify-center gap-6 h-full text-center max-w-2xl mx-auto">
          <Shield size={80} className="text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.8)] mb-4" />
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest">Protección Activa</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Tu cuenta está asegurada con encriptación AES-256 de extremo a extremo en el navegador. Las transmisiones de red utilizan túneles seguros.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-6 text-left">
            <div className="p-4 border border-emerald-500/30 bg-emerald-900/10 rounded-md">
              <span className="text-emerald-400 font-bold block mb-1 uppercase tracking-widest text-xs">Aviso</span>
              <span className="text-slate-400 text-xs">Nunca compartas tu contraseña ni tu código de recuperación con nadie. El staff nunca te pedirá tus datos de acceso.</span>
            </div>
            <div className="p-4 border border-emerald-500/30 bg-emerald-900/10 rounded-md">
              <span className="text-emerald-400 font-bold block mb-1 uppercase tracking-widest text-xs">Juego Responsable</span>
              <span className="text-slate-400 text-xs">Mantén un control estricto de tu tiempo y créditos. Si sientes que la diversión se acaba, toma un descanso. Diviértete de forma segura.</span>
            </div>
          </div>
       </div>
    </WindowPanel>
  )
}

function HelpPanel() {
  return (
    <WindowPanel title="SOPORTE Y GUÍA HOLOGRÁFICA" className="flex-grow shadow-[0_0_30px_rgba(217,70,239,0.15)] overflow-y-auto p-6 md:p-10">
       <div className="flex flex-col gap-8 max-w-3xl mx-auto h-full justify-center">
          <div className="flex items-center gap-4 text-fuchsia-400">
             <HelpCircle size={40} className="drop-shadow-[0_0_15px_rgba(217,70,239,0.8)]" />
             <h2 className="text-2xl font-black text-white uppercase tracking-widest">¿Cómo Jugar?</h2>
          </div>
          
          <div className="flex flex-col gap-4 text-sm text-slate-300">
            <p><strong>Proyecto Cash</strong> es una terminal de minijuegos diseñados con reglas RNG estrictas. Cada juego tiene su propio nivel de volatilidad (riesgo) y multiplicadores de ganancia.</p>
            
            <div className="border border-fuchsia-900/50 bg-[#080b18] p-4 rounded-md">
               <h3 className="text-cyan-300 font-bold mb-2 tracking-widest">1. ALMACENAMIENTO DE FONDOS</h3>
               <p className="text-xs leading-relaxed text-slate-400">Tu balance se actualiza en tiempo real a medida que ganas o pierdes. Sin embargo, para persistir permanentemente los datos en la nube global, debes realizar un <strong>Depósito</strong> manual desde la pestaña superior u home, o esperar al ciclo imperceptible de guardado y recarga.</p>
            </div>

            <div className="border border-fuchsia-900/50 bg-[#080b18] p-4 rounded-md">
               <h3 className="text-cyan-300 font-bold mb-2 tracking-widest">2. FUNCIONAMIENTO DE LOS JUEGOS</h3>
               <ul className="list-disc pl-5 text-xs text-slate-400 flex flex-col gap-2">
                 <li><strong>Neon Slots:</strong> Alinea 3 símbolos idénticos para el multiplicador máximo.</li>
                 <li><strong>Quick Ladder:</strong> Un juego de empuje. A medida que subes aumenta el riesgo de caer.</li>
                 <li><strong>Void Crash:</strong> Sal antes de que la línea se rompa. ¿Podrás llegar al multiplicador x5?</li>
               </ul>
            </div>
          </div>
       </div>
    </WindowPanel>
  )
}

function NeonTitle() {
  return (
    <div className="flex justify-center my-2 pointer-events-none">
      <div className="border-[3px] border-pink-500 py-1.5 px-6 rounded-md shadow-[0_0_20px_rgba(236,72,153,0.6),inset_0_0_15px_rgba(236,72,153,0.4)] bg-[#1a0515]/80 transform -skew-x-[15deg] backdrop-blur-sm relative">
        <div className="absolute -inset-1 border-2 border-cyan-400 opacity-50 blur-[2px] rounded-md" />
        <h1 className="text-3xl lg:text-5xl text-center font-black leading-none tracking-widest transform skew-x-[15deg]">
          <span className="block text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,1)] mb-1">Proyecto</span>
          <span className="block text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,1)] text-2xl lg:text-3xl">Cash</span>
        </h1>
      </div>
    </div>
  )
}

function UserProfilePanel({ balance, username, userId }: { balance: number, username?: string, userId?: string }) {
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const { setUser, setBalance } = useCasinoStore();

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch("/api/user/save-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, balance })
      });
      if (res.ok) {
        setSaveStatus("success");
      } else {
        setSaveStatus("error");
      }
    } catch (e) {
      setSaveStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setBalance(0);
  };

  return (
    <WindowPanel title="Perfil de Usuario" controls={true} className="border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
      <div className="flex flex-col items-center gap-4 p-5">
        <span className="text-blue-300 font-bold tracking-widest text-lg drop-shadow-[0_0_8px_rgba(147,197,253,0.8)] uppercase">
           {username || "NEON_GAMER"}
        </span>
        
        <div className="relative">
           <div className="absolute inset-0 bg-orange-500/20 rounded-lg blur-xl animate-pulse" />
           <div className="w-28 h-28 bg-[#151b2d] rounded-lg border-2 border-slate-600 flex items-center justify-center text-6xl shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden">
             🤷‍♂️
             <div className="absolute flex justify-between w-full px-2 top-8 text-yellow-400 text-xl animate-bounce">
               <span>🪙</span><span>🪙</span>
             </div>
           </div>
        </div>
        
        <div className="flex flex-col items-center gap-2 w-full mt-2">
           <AnimatedBalance balance={balance} />
           
           <div className="flex gap-2 w-full mt-2">
             <button 
               onClick={handleSave} 
               disabled={saving}
               className={`flex-1 font-bold rounded-[4px] py-1.5 shadow-[0_4px_0_#0a1524,0_0_15px_rgba(56,189,248,0.3)] border transition-all uppercase tracking-widest text-xs active:translate-y-1 active:shadow-none
                 ${saveStatus === "success" ? "bg-green-600 border-green-500 text-white" : 
                   saveStatus === "error" ? "bg-red-600 border-red-500 text-white" : 
                   "bg-gradient-to-b from-[#234b6b] to-[#122e47] hover:from-[#2c5f87] hover:to-[#183b5c] border-cyan-700/50 text-white"} 
                 disabled:opacity-50`}
             >
               {saving ? "GUARDANDO..." : saveStatus === "success" ? "¡GUARDADO!" : "DEPOSITAR"}
             </button>
             <button 
               onClick={handleLogout}
               className="w-10 bg-red-900/50 hover:bg-red-800/80 border border-red-700 text-red-300 rounded-[4px] shadow-sm flex items-center justify-center transition-colors hover:text-white"
               title="Cerrar Sesión"
             >
               <X size={16} strokeWidth={3} />
             </button>
           </div>
           
        </div>
      </div>
    </WindowPanel>
  )
}

function RecentActivityPanel({ username }: { username?: string }) {
  return (
    <WindowPanel className="border-emerald-700/50 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
      <h3 className="text-emerald-400 font-bold text-sm tracking-widest flex items-center gap-2 bg-[#091b16] py-2 px-4 border-l-[3px] border-emerald-500">
        <Lock size={14} className="text-emerald-500" /> ACTIVIDAD RECIENTE
      </h3>
      <div className="flex flex-col gap-1.5 text-xs text-slate-300 font-mono overflow-y-auto h-32 p-3 pb-4">
        <div className="text-cyan-400 border-b border-white/5 pb-1">Conexión: {username}</div>
        <div className="text-cyan-600 border-b border-white/5 pb-1">Regalo Inicial: +1,000 G</div>
        <div className="text-cyan-800 border-b border-white/5 pb-1">Sistema inicializado</div>
      </div>
    </WindowPanel>
  )
}

interface UserScore {
  _id: string;
  username: string;
  balance: number;
}

function HighScoresPanel() {
  const [highScores, setHighScores] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/high-scores')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.users) {
          setHighScores(data.users);
        }
      })
      .catch(err => console.error("Error fetching high scores", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <WindowPanel className="border-slate-700/80 shadow-[0_0_15px_rgba(255,255,255,0.05)] flex-grow flex flex-col relative min-h-[220px]">
      <h3 className="text-white font-bold text-sm tracking-widest flex items-center justify-center gap-2 bg-gradient-to-r from-transparent via-white/10 to-transparent p-2 border-t border-b border-white/10">
        PUNTUACIONES ALTAS
      </h3>
      <div className="flex flex-col gap-0 text-[11px] xl:text-xs font-mono p-3 overflow-y-auto h-full flex-grow">
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <span className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Cargando datos cuánticos...</span>
          </div>
        ) : highScores.length === 0 ? (
          <div className="flex items-center justify-center p-4">
            <span className="text-slate-500 font-bold uppercase tracking-widest">Sin registros</span>
          </div>
        ) : (
          highScores.map((userScore, index) => {
            let color = "text-slate-400";
            if (index === 0) color = "text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]";
            else if (index === 1) color = "text-slate-300";
            else if (index === 2) color = "text-orange-400";
            else if (index <= 4) color = "text-cyan-400";

            return (
              <ScoreRow 
                key={userScore._id || index} 
                rank={index + 1} 
                name={userScore.username || "Desconocido"} 
                score={`${(userScore.balance || 0).toLocaleString()} G`} 
                color={color} 
              />
            );
          })
        )}
      </div>
    </WindowPanel>
  )
}

interface ScoreRowProps {
  rank: number;
  name: string;
  score: string | number;
  color: string;
}

function ScoreRow({ rank, name, score, color }: ScoreRowProps) {
  return (
    <div className="grid grid-cols-[16px_16px_1fr_auto] gap-2 items-center border-b border-white/5 py-1.5 hover:bg-white/5 transition-colors px-2">
      <span className="text-slate-500 font-bold">{rank}.</span>
      <Trophy size={12} className={color} strokeWidth={3} />
      <span className={`${color} truncate tracking-wider`}>{name}</span>
      <span className="text-white text-right font-bold">{score}</span>
    </div>
  )
}

interface GameBubbleProps {
  game: GameConfig;
  onSelect: (game: GameConfig) => void;
}

function GameBubble({ game, onSelect }: GameBubbleProps) {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer group w-full" onClick={() => onSelect(game)}>
      <motion.div 
         whileHover={{ scale: 1.05 }}
         whileTap={{ scale: 0.95 }}
         className={`relative w-[4.5rem] h-[4.5rem] md:w-[6rem] md:h-[6rem] rounded-full border-[3px] border-cyan-400 bg-gradient-to-br ${game.theme} p-0.5 shadow-[0_0_15px_rgba(34,211,238,0.4),inset_0_0_10px_rgba(255,255,255,0.5)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.8),inset_0_0_15px_rgba(255,255,255,0.8)] transition-all`}
      >
        <div className="w-full h-full rounded-full bg-[#0a0f1d] flex items-center justify-center overflow-hidden relative shadow-[inset_0_0_15px_rgba(0,0,0,0.9)]">
           <div className={`absolute inset-0 bg-gradient-to-tr ${game.theme} mix-blend-color-dodge opacity-20`} />
           
           {/* Scanline effect */}
           <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none" />

           <span className="text-3xl md:text-4xl drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] group-hover:animate-pulse">
             {getGameIcon(game.name)}
           </span>
           
           {/* Top reflection */}
           <div className="absolute top-0 inset-x-2 h-1/3 bg-white/20 rounded-full blur-[2px]" />
        </div>
        {/* Magic stars decoration on hover */}
        <div className="absolute -top-1 -right-1 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_5px_yellow]">✨</div>
      </motion.div>
      <div className="flex flex-col items-center mt-1">
        <span className="text-white text-[11px] md:text-sm font-bold tracking-widest text-center group-hover:text-cyan-300">
          {game.name}
        </span>
        <span className="text-slate-400 text-[9px] md:text-[10px] text-center max-w-[120px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-normal leading-tight">
          {game.description}
        </span>
      </div>
    </div>
  )
}

function getGameIcon(name: string) {
  const map: Record<string, string> = {
    'Neon Slots': '🎰',
    'Cyber Roulette': '🎡',
    'Crystal Burst': '💎',
    'Quick Ladder': '🪜',
    'Binary Flip': '🪙',
    'Orbit Miner': '🪐',
    'Pulse Match': '📉',
    'Void Crash': '🚀',
    'Turbo Dice': '🎲',
    'Signal Guess': '🎛️'
  };
  return map[name] || '🎮';
}

function AnimatedBalance({ balance }: { balance: number }) {
  const [glow, setGlow] = useState<"none" | "green" | "red">("none");

  useEffect(() => {
    const t = setTimeout(() => setGlow("green"), 0);
    const t2 = setTimeout(() => setGlow("none"), 800);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [balance]);

  return (
    <motion.div 
      key={balance}
      initial={{ scale: 1.1, color: glow === "green" ? "#4ade80" : "#ffffff" }}
      animate={{ scale: 1, color: "#ffffff" }}
      className="text-white text-md lg:text-lg font-black tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] bg-black/40 px-4 py-1.5 rounded-sm border border-slate-700/50"
    >
      Créditos: {balance.toLocaleString()} G
    </motion.div>
  );
}
