import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen w-full bg-[#050510] text-cyan-50 font-mono relative overflow-auto selection:bg-fuchsia-500/30 pb-20">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a2a] via-[#050510] to-[#010103] opacity-80 pointer-events-none fixed" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-screen pointer-events-none fixed" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 font-bold hover:text-white transition-colors self-start border border-cyan-800/50 bg-cyan-900/20 px-4 py-2 rounded-sm backdrop-blur-sm">
            <ArrowLeft size={16} /> VOLVER AL CASINO
          </Link>

          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] tracking-widest uppercase border-l-4 border-fuchsia-500 pl-4">
              AVISO DE PRIVACIDAD Y <span className="text-fuchsia-400">TÉRMINOS DE SERVICIO</span>
            </h1>
            <p className="text-slate-400 mt-4 text-sm md:text-base font-semibold tracking-wide">
              Última actualización: Marzo 2026. Proyecto Cash - Tu Casino Estelar.
            </p>
          </div>
        </div>

        {/* Content Box */}
        <div className="border border-slate-700/80 bg-[#0a1020]/90 backdrop-blur-md rounded-xl p-6 md:p-12 shadow-[0_0_40px_rgba(34,211,238,0.1)] text-slate-300 leading-relaxed tracking-wide space-y-8">
          
          <section>
            <h2 className="text-xl font-bold text-cyan-400 mb-4 tracking-widest uppercase">1. Introducción y Aceptación</h2>
            <p className="mb-4">
              Bienvenido a <strong>Proyecto Cash | Tu Casino Estelar</strong> (en adelante, "la Plataforma", "nosotros" o "la Compañía"). Al acceder, navegar, registrarse o utilizar de cualquier manera esta plataforma web y sus servicios asociados, usted (en adelante, "el Usuario" o "usted") acepta estar legalmente vinculado a estos Términos de Servicio y Condiciones de Uso, así como a nuestra Política de Privacidad detallada a continuación.
            </p>
            <p className="mb-4">
              Esta Plataforma está diseñada estrictamente con fines de entretenimiento y simulación digital (minijuegos de azar lúdicos y simuladores cuánticos). <strong>En ningún momento ni bajo ninguna circunstancia, el juego compensará o recompensará a los usuarios con dinero real</strong>, moneda de curso legal, criptoactivos con valor en el mercado fiat, premios convertibles a dinero en efectivo, ni bienes tangibles del mundo real. Todos los "CRÉDITOS G" mencionados en la Plataforma son ficticios y carecen por completo de valor fiscal o económico fuera del entorno de simulación estelar.
            </p>
            <p>
              Si usted no está de acuerdo con la totalidad de estos términos, no comprende su alcance de entretenimiento, o pretende buscar una ganancia financiera genuina, le rogamos que se abstenga de utilizar nuestros servicios inmediatamente y proceda a eliminar su cuenta si ya poseyera una. La Compañía se reserva el derecho de vetar, bloquear o expulsar a cualquier usuario que no respete esta premisa fundamental.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-fuchsia-400 mb-4 tracking-widest uppercase">2. Recopilación y Uso de Datos</h2>
            <p className="mb-4">
              La protección de su privacidad y la confidencialidad de su experiencia estelar es importante para Proyecto Cash. Sin embargo, para poder desplegar nuestras funcionalidades algorítmicas cuánticas, nos vemos en la necesidad imperativa de recopilar y almacenar ciertos datos personales y de comportamiento.
            </p>
            <p className="mb-4">
              <strong>Datos Recopilados:</strong> Al registrarse, usted proporciona de manera voluntaria información básica como correo electrónico y nombre de usuario. Posteriormente, nuestro sistema rastrea automáticamente su dirección IP, historial de conexión, interacciones con nuestra grilla de juegos, patrones de apuestas de "CRÉDITOS G", ganancias, y comportamiento en la plataforma mediante métricas de telemetría in-app.
            </p>
            <p className="mb-4 text-cyan-200 bg-cyan-900/20 p-4 border-l-2 border-cyan-500 rounded-r-md">
              <em>Notificación de Fines Múltiples:</em> Usted acepta expresamente que los datos que solicitamos durante su uso rutinario pueden y serán utilizados para <strong>otros fines más allá del simple soporte al cliente</strong>. Entre estos fines secundarios se incluyen: auditorías algorítmicas, perfilado estadístico de patrones probabilísticos, entrenamiento de redes neuronales de la plataforma para calibrar el balance de las mesas de juego, y campañas de marketing directas o segmentadas, así como compartición de estadísticas anónimas agrupadas con terceros colaboradores sin previo aviso ni compensación alguna hacia su persona.
            </p>
            <p>
              A pesar de la cesión descrita, sus datos de contacto (como el email y su contraseña encriptada) son resguardados celosamente mediante técnicas hash avanzadas (tipo AES) para imposibilitar su extracción literal, garantizando de esta manera que sus credenciales fundamentales permanezcan fuera de riesgo. 
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-yellow-400 mb-4 tracking-widest uppercase">3. Restricciones de Edad</h2>
            <p className="mb-4">
              <strong>Menores de 16 años tienen estrictamente prohibido el acceso o registro de cuentas operativas en la plataforma.</strong> Aunque la naturaleza de "Proyecto Cash" es netamente simulada y no involucra dinero real, el lenguaje de las temáticas visuales imita mecánicas de apuestas (Gamble-like loops).
            </p>
            <p>
              Por tal motivo, las leyes internacionales de protección digital obligan a aplicar esta barrera restrictiva. Durante su registro, se exige la marcación explícita bajo juramento de ser mayor de 16 años de edad civil legal. Falsificar esta métrica conlleva la revocación permanente e inmediata de la credencial criptográfica de conexión, así como el reinicio a "Cero Cósmico" de cualquier puntaje de tabla clasificatoria alcanzado bajo dichas premisas falsas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-green-400 mb-4 tracking-widest uppercase">4. Comunidad y Código de Conducta</h2>
            <p className="mb-4">
              Esta galaxia lúdica fue diseñada primordialmente para forjar una atmósfera relajante, equitativa y competitiva entre jugadores casuales alrededor del globo. Como miembro afiliado:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Usted se compromete a mantener firmemente y en toda ocasión, una comunidad agradable y respetuosa con los otros participantes, independientemente del modo de juego (ya sean ruletas cooperativas o paneles de chat).</li>
              <li>Acosar, insultar, usar lenguajes de discriminación, doxing (revelación de información privada del adversario), difamación o toxicidad genérica resultará en un bloqueo por medio del Algoritmo Centinela.</li>
              <li>La promoción de esquemas de pirámide engañosos usando los "Códigos de Refferal" engañando a usuarios nuevos incurre en faltas gravísimas contra los servidores.</li>
              <li>Está totalmente prohibido intentar manipular los scripts de frontend, practicar inyecciones maliciosas, usar software de macro-clicking automatizado para engañar al sistema de balance, o simular caídas de lag-switch para anular pérdidas justas en partidas de Tragamonedas o Apuestas Sociales.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pink-400 mb-4 tracking-widest uppercase">5. Modificaciones y Derecho a Cambios sin Previo Aviso</h2>
            <p className="mb-4">
              Debido a la naturaleza acelerada de las actualizaciones cuánticas en el ámbito web, el universo cibernético de "Proyecto Cash" evoluciona de manera fluida y constante. Como resultado pragmático y técnico de esto:
            </p>
            <p className="mb-4 bg-slate-800 p-4 border border-slate-600 rounded-md text-slate-100 font-semibold text-sm">
              LA COMPAÑÍA SE RESERVA EL DERECHO EXCLUSIVO DE MODIFICAR, ALTERAR, REMOVER O AÑADIR CUALQUIER SECCIÓN DE ESTOS TÉRMINOS, DE LAS REGLAS DE LOS JUEGOS, DE LAS PROBABILIDADES MATEMÁTICAS INTERNAS (RNG), DEL VALOR DEL "CRÉDITO G", Y DEL INTERFAZ GRÁFICO DEL USUARIO EN CUALQUIER MOMENTO Y SIN ESTAR OBLIGADO A OFRECER NINGÚN TIPO DE PREVIO AVISO.
            </p>
            <p>
              Es responsabilidad innegable del Usuario final revisar periódicamente esta página virtual para cerciorarse de sus responsabilidades actuales. El simple acto de loggearse en la terminal central de su "Perfil Estelar" tras la entrada en vigencia de cualquier alteración en el presente pacto silencioso de uso, constituye e implica automáticamente la lectura aceptada y la sumisión voluntaria al renovado marco regulatorio imperante en el servidor.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-cyan-400 mb-4 tracking-widest uppercase">6. Exención de Garantías y Limitación Cautelar</h2>
            <p className="mb-4">
              El servicio centralizado se ofrece y provee puramente en un régimen técnico de "Tal Como Está" (As-Is) y "Según se encuentre Disponible" (As-Available). Esto implica que los desarrolladores y el equipo de mantenimiento intergaláctico global de Proyecto Cash no garantizan la persistencia de bases de datos infinitas. Sus créditos G acumulados, rachas de suerte y tableros de High Scores están siempre a merced de posibles contingencias de software, borrados o "wipes" rutinarios de los discos de estado sólido para desfragmetar memorias masivas de nuestros servidores subyacentes.
            </p>
            <p className="mb-4">
              Al someter el formulario en primer plano con el botón "Crear Cuenta", usted confirma bajo testimonio solemne, cediendo su aprobación, su mayoría de edad técnica (16+), la comprensión explícita y certera de que sus ganancias en el sitio no mutarán a riqueza del plano físico material, y que la telemetría recolectada en pro de esta simulación quedará resguardada a perenne custodia de Proyecto Cash por el lapso vital que lo requiera.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
