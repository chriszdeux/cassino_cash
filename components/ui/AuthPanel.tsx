"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCasinoStore } from "@/lib/store";

export default function AuthPanel() {
  const [isLogin, setIsLogin] = useState(true);
  const { setUser, setBalance, setSavedBalance } = useCasinoStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [ageCheck, setAgeCheck] = useState(false);
  const [termsCheck, setTermsCheck] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (isLogin) {
      if (!email || !password) {
        setErrorMsg("Ingresa tu usuario/correo y contraseña.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: email, password }),
        });
        const data = await res.json();
        if (data.success) {
          setSuccess(true);
          setTimeout(() => {
            setUser({ id: data.user.id, username: data.user.username, email: data.user.email });
            setBalance(data.user.balance);
            setSavedBalance(data.user.balance);
            // Component unmounts here since user is set
          }, 1500);
        } else {
          setErrorMsg(data.message || "Error al iniciar sesión.");
          setLoading(false);
        }
      } catch {
        setErrorMsg("Error de conexión.");
        setLoading(false);
      }
    } else {
      if (!email || !password || !username) {
        setErrorMsg("Todos los campos de texto son obligatorios.");
        setLoading(false);
        return;
      }
      if (!ageCheck) {
        setErrorMsg("Debes confirmar que eres mayor de 16 años.");
        setLoading(false);
        return;
      }
      if (!termsCheck) {
        setErrorMsg("Debes aceptar los Términos y Condiciones / Aviso de Privacidad.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, username, isOver16: ageCheck, termsAccepted: termsCheck, referralCodeInput }),
        });
        const data = await res.json();
        if (data.success) {
          setSuccess(true);
          setTimeout(() => {
            setUser({ id: data.user.id, username: data.user.username, email: data.user.email });
            setBalance(data.user.balance);
            setSavedBalance(data.user.balance);
          }, 1500);
        } else {
          setErrorMsg(data.message || "Error al registrar.");
          setLoading(false);
        }
      } catch {
        setErrorMsg("Error de conexión.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="border-[1.5px] border-slate-600/80 p-3 pt-4 rounded-md bg-[#0a1020]/90 shadow-[0_0_15px_rgba(34,211,238,0.15)] relative mt-2 flex flex-col gap-3 h-auto">
      
      {/* Tabs */}
      <div className="flex w-full bg-[#111827] rounded-sm p-1 border border-slate-700">
         <button 
           onClick={() => { setIsLogin(true); setErrorMsg(""); }}
           className={`flex-1 py-1.5 text-xs font-bold transition-all rounded-sm ${isLogin ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'text-slate-400 hover:text-white'}`}
         >
            INGRESAR
         </button>
         <button 
           onClick={() => { setIsLogin(false); setErrorMsg(""); }}
           className={`flex-1 py-1.5 text-xs font-bold transition-all rounded-sm ${!isLogin ? 'bg-fuchsia-600 text-white shadow-[0_0_10px_rgba(217,70,239,0.5)]' : 'text-slate-400 hover:text-white'}`}
         >
            REGISTRO
         </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={isLogin ? "login" : "register"}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-2 relative z-10"
        >

           <form onSubmit={handleSubmit} className="flex flex-col gap-2">
             <input type={isLogin ? "text" : "email"} placeholder={isLogin ? "Usuario / Correo" : "Correo Electrónico"} value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} className="bg-[#111827] border border-slate-600 text-xs px-2 py-2 text-white outline-none focus:border-cyan-400 rounded-sm w-full transition-colors" />
             
             {!isLogin && (
               <input type="text" placeholder="Nombre de Usuario" value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading} className="bg-[#111827] border border-slate-600 text-xs px-2 py-2 text-white outline-none focus:border-cyan-400 rounded-sm w-full transition-colors" />
             )}

             <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className="bg-[#111827] border border-slate-600 text-xs px-2 py-2 text-white outline-none focus:border-cyan-400 rounded-sm w-full transition-colors" />
             
             {!isLogin && (
               <>
                 <input type="password" placeholder="Repetir Contraseña" disabled={loading} className="bg-[#111827] border border-slate-600 text-xs px-2 py-2 text-white outline-none focus:border-cyan-400 rounded-sm w-full transition-colors" />
                 
                 <label className="text-slate-400 text-xs font-semibold mt-1">Código de Referido (Opcional):</label>
                 <input type="text" placeholder="ABCDEF12" maxLength={8} value={referralCodeInput} onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())} disabled={loading} className="bg-[#111827] border border-fuchsia-600/50 text-xs px-2 py-2 text-white outline-none focus:border-fuchsia-400 rounded-sm w-full transition-colors uppercase" />

                 <div className="flex flex-col gap-2 mt-2 mb-1">
                   <div className="flex items-start gap-2 border border-slate-700/50 p-2 rounded-sm bg-black/20">
                     <input type="checkbox" id="ageCheck" checked={ageCheck} onChange={(e) => setAgeCheck(e.target.checked)} disabled={loading} className="mt-0.5 accent-cyan-500 w-3.5 h-3.5 cursor-pointer shrink-0" />
                     <label htmlFor="ageCheck" className="text-[10px] text-slate-300 leading-tight cursor-pointer">
                       Confirmo explícitamente que soy <strong className="text-cyan-400">MAYOR de 16 años de edad</strong>.
                     </label>
                   </div>
                   
                   <div className="flex items-start gap-2 border border-slate-700/50 p-2 rounded-sm bg-black/20">
                     <input type="checkbox" id="termsCheck" checked={termsCheck} onChange={(e) => setTermsCheck(e.target.checked)} disabled={loading} className="mt-0.5 accent-fuchsia-500 w-3.5 h-3.5 cursor-pointer shrink-0" />
                     <label htmlFor="termsCheck" className="text-[10px] text-slate-300 leading-tight cursor-pointer">
                       Acepto los <a href="/aviso-de-privacidad" target="_blank" className="text-fuchsia-400 hover:text-white underline underline-offset-2">Términos, Condiciones y Aviso de Privacidad</a> de este casino estelar.
                     </label>
                   </div>
                 </div>
               </>
             )}

             {errorMsg && (
               <div className="text-red-400 text-[10px] font-bold text-center mt-1 bg-red-900/20 py-1 rounded-sm border border-red-500/30">
                 {errorMsg}
               </div>
             )}

             <button type="submit" disabled={loading || success} className={`w-full py-2 mt-1 rounded-sm text-xs font-black tracking-widest text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-50 ${success ? 'bg-green-500 hover:bg-green-400 !opacity-100 scale-[1.02]' : isLogin ? 'bg-cyan-700 hover:bg-cyan-600' : 'bg-fuchsia-700 hover:bg-fuchsia-600'}`}>
                {success ? "¡BIENVENIDO!" : loading ? "CARGANDO..." : (isLogin ? "INICIAR SESIÓN" : "CREAR CUENTA")}
             </button>
           </form>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0a1020]/95 z-50 flex flex-col items-center justify-center rounded-md border-[2px] border-green-500/80 backdrop-blur-md shadow-[inset_0_0_50px_rgba(34,197,94,0.2)]"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Lock size={50} strokeWidth={2} className="text-green-400 mb-2 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
            </motion.div>
            <span className="text-green-400 font-black tracking-widest mt-2 text-lg drop-shadow-[0_0_10px_rgba(34,197,94,1)]">ACCESO</span>
            <span className="text-white font-bold tracking-widest">CONCEDIDO</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute right-4 top-4 flex flex-col items-center justify-center text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)] opacity-20 pointer-events-none z-0">
        <Lock size={40} strokeWidth={1} />
      </div>
    </div>
  )
}
