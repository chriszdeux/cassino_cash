const fs = require("fs");
const path = require("path");
const gamesDir = path.resolve("./components/games");

const files = fs.readdirSync(gamesDir).filter((f) => f.endsWith(".tsx"));

for (const file of files) {
  const filePath = path.join(gamesDir, file);
  let content = fs.readFileSync(filePath, "utf8");

  // Find: body: JSON.stringify({ gameId: "NAME", betAmount: bet ... } as PlayRequest)
  // Replaced with: body: JSON.stringify({ gameId: "NAME", betAmount: bet, currentBalance: balance ... } as PlayRequest)

  if (content.includes("currentBalance:")) {
    continue; // already updated
  }

  // Use reggae expression to add currentBalance after betAmount
  let newContent = content.replace(
    /betAmount:\s*bet(?!,\s*currentBalance)/g,
    "betAmount: bet, currentBalance: balance",
  );

  // also handle SignalGuess which might have betAmount: bet, payload:
  // previous replace matches both, let's verify.
  fs.writeFileSync(filePath, newContent);
}

console.log("Updated minigames");
