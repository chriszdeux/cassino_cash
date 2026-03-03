const fs = require("fs");
const path = require("path");

const gamesDir = path.resolve("./components/games");
const files = fs.readdirSync(gamesDir).filter((f) => f.endsWith(".tsx"));

const gameDescriptions = {
  "NeonSlots.tsx":
    "Gira los rodillos. Consigue 2 o 3 símbolos iguales para multiplicar tu apuesta.",
  "CyberRoulette.tsx":
    "Ruleta cibernética. Apuesta al rojo, negro, par, impar o verde.",
  "CrystalBurst.tsx":
    "Busca cristales seguros y acumula multiplicadores. Cuidado con la bomba.",
  "BinaryFlip.tsx": "Lanza la moneda digital. Elige Cara o Cruz para ganar.",
  "TurboDice.tsx":
    "Lanza dos dados. Apuesta a sumas bajas (2-6), altas (8-12) o al siete exacto.",
  "VoidCrash.tsx":
    "El multiplicador sube. Retira tus ganancias antes de que el vacío explote.",
  "PulseMatch.tsx": "Encuentra la carta oculta ganadora entre las 3 opciones.",
  "QuickLadder.tsx":
    "Escala los peldaños. A mayor altura, mayor premio y mayor riesgo de caer.",
  "OrbMiner.tsx":
    "Selecciona una coordenada del cristal cuántico y busca el premio.",
  "SignalGuess.tsx":
    "Adivina si la próxima señal será mayor o menor a la actual.",
};

for (const file of files) {
  const filePath = path.join(gamesDir, file);
  let content = fs.readFileSync(filePath, "utf-8");

  // Translate common strings
  content = content.replace(
    /"Invalid bet amount"/g,
    '"Monto de apuesta inválido"',
  );
  content = content.replace(
    /"Invalid bet or target"/g,
    '"Apuesta o retiro inválido"',
  );
  content = content.replace(/"Error server"/g, '"Error del servidor"');
  content = content.replace(/"Network error"/g, '"Error de red"');
  content = content.replace(/YOU WON \$/g, "¡GANASTE $");
  content = content.replace(/You lost/g, "Has perdido");
  content = content.replace(/You lost\./g, "Has perdido.");
  content = content.replace(/"SPINNING..."/g, '"GIRANDO..."');
  content = content.replace(/"SPIN!"/g, '"¡GIRAR!"');
  content = content.replace(/"FLYING..."/g, '"VOLANDO..."');
  content = content.replace(/"LAUNCH"/g, '"DESPEGAR"');
  content = content.replace(/>HEADS</g, ">CARA<");
  content = content.replace(/"heads"/g, '"cara"');
  content = content.replace(/>TAILS</g, ">CRUZ<");
  content = content.replace(/"tails"/g, '"cruz"');
  content = content.replace(/CRASHED AT/g, "EXPLOTÓ EN");
  content = content.replace(/CASHED OUT \$/g, "COBRASTE $");
  content = content.replace(/"low"/g, '"bajo"');
  content = content.replace(/"high"/g, '"alto"');
  content = content.replace(/"seven"/g, '"siete"');
  content = content.replace(/>LOW \(2-6\)</g, ">BAJO (2-6)<");
  content = content.replace(/>HIGH \(8-12\)</g, ">ALTO (8-12)<");
  content = content.replace(/"red"/g, '"rojo"');
  content = content.replace(/"black"/g, '"negro"');
  content = content.replace(/"even"/g, '"par"');
  content = content.replace(/"odd"/g, '"impar"');
  content = content.replace(/"green"/g, '"verde"');
  content = content.replace(/"higher"/g, '"mayor"');
  content = content.replace(/"lower"/g, '"menor"');
  content = content.replace(/"pick"/g, '"elegir"');
  content = content.replace(/"cashout"/g, '"retirar"');
  content = content.replace(/>HIGHER</g, ">MAYOR<");
  content = content.replace(/>LOWER</g, ">MENOR<");

  // Inject description safely
  const desc = gameDescriptions[file];
  if (desc && !content.includes(desc)) {
    // Find the first <div className="... flex flex-col items-center ..."> after return (
    // Because some games have slightly different wrappers, let's just find `return (` and inject after the first `<div ...>`

    const componentReturnMatch = content.match(/return\s*\(\s*<div[^>]*>/);
    if (componentReturnMatch) {
      content = content.replace(
        componentReturnMatch[0],
        `${componentReturnMatch[0]}
      <div className="text-center mb-6 max-w-sm px-4">
         <p className="text-slate-400 text-sm font-medium tracking-wide leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5 shadow-inner">
           ${desc}
         </p>
      </div>`,
      );
    }
  }

  // Ensure bet controls labels if there are any are in spanish
  // Handled BetControls generally, but let's check VoidCrash "Out At:" -> "Retirar en:"
  content = content.replace(/Out At:/g, "Retirar en:");

  fs.writeFileSync(filePath, content, "utf-8");
  console.log("Translated", file);
}
