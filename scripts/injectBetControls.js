const fs = require("fs");
const path = require("path");

const gamesDir = path.resolve("./components/games");
const files = fs.readdirSync(gamesDir).filter((f) => f.endsWith(".tsx"));

for (const file of files) {
  const filePath = path.join(gamesDir, file);
  let content = fs.readFileSync(filePath, "utf-8");

  // Skip if already imported
  if (!content.includes("import BetControls")) {
    content = content.replace(
      /from "framer-motion";|from 'framer-motion';/g,
      `from "framer-motion";\nimport BetControls from "@/components/ui/BetControls";`,
    );
  }

  // Very specific Regex to find exactly my custom bet input wrappers
  // Example: <div className="flex items-center gap-4 bg-black/50 p-3 rounded-full border border-white/10 mt-4"> ... </div>
  // Because they differ slightly, we'll search for <label ...>Bet:</label> ... <input ... />

  // This regex matches the entire <div ...> that contains the Bet label and input
  const wrapperRegex =
    /<div className="flex items-center[^>]*bg-black\/(?:40|50|60)[^>]*>[\s\S]*?<label[^>]*>Bet:<\/label>[\s\S]*?<input[^>]*type="number"[^>]*>[\s\S]*?<\/div>/;

  // Let's also support the version without 'w-full' directly on the flex container but wrapping the label
  const wrapperRegex2 =
    /<div className="flex items-center[^>]*>[\s\S]*?<label[^>]*>Bet:<\/label>[\s\S]*?<input[^>]*>[\s\S]*?<\/div>/g;

  content = content.replace(wrapperRegex2, (match) => {
    // We must be careful if the wrapper contains other elements like targetMultiplier
    if (match.includes("targetMultiplier") || match.includes("Out@")) {
      // Void Crash has a special input inside the flex
      return match;
    }
    return `<BetControls bet={bet} setBet={setBet} loading={loading} />`;
  });

  // Handle VoidCrash specifically since it has multiple inputs in one container
  if (file === "VoidCrash.tsx") {
    const vcRegex =
      /<div className="flex items-center gap-2 bg-black\/60 p-3 rounded-full border border-white\/10 mt-2">[\s\S]*?<label className="text-gray-400 font-semibold uppercase tracking-wider pl-4">Bet:<\/label>[\s\S]*?<input [\s\S]*?type="number" disabled={loading} value={bet} onChange={\(e\) => setBet\(Number\(e.target.value\)\)}[\s\S]*?\/>[\s\S]*?<div className="w-\[1px\] h-6 bg-white\/20 mx-2" \/>[\s\S]*?<label className="text-gray-400 font-semibold uppercase tracking-wider">Out@<\/label>[\s\S]*?<input [\s\S]*?type="number" step="0\.1" disabled={loading} value={targetMultiplier} onChange={\(e\) => setTargetMultiplier\(Number\(e\.target\.value\)\)}[\s\S]*?\/>[\s\S]*?<\/div>/;

    content = content.replace(
      vcRegex,
      `<BetControls bet={bet} setBet={setBet} loading={loading} />
         <div className="flex items-center justify-between bg-black/90 px-4 py-3 rounded-xl border border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)] mt-2 w-full max-w-[280px]">
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Out At:</label>
            <input 
              type="number" 
              step="0.1" 
              disabled={loading} 
              value={targetMultiplier} 
              onChange={(e) => setTargetMultiplier(Number(e.target.value))} 
              className="w-16 bg-transparent text-white font-black outline-none text-right pr-2 text-2xl"
            />
         </div>`,
    );
  }

  // Handle SignalGuess specifically since it has multiple inputs in one container ... wait no, SignalGuess only has Bet

  fs.writeFileSync(filePath, content, "utf-8");
  console.log("Processed", file);
}
