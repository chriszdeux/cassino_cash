const fs = require("fs");
const path = require("path");

const gamesDir = path.resolve("./components/games");
const files = fs.readdirSync(gamesDir).filter((f) => f.endsWith(".tsx"));

for (const file of files) {
  const filePath = path.join(gamesDir, file);
  let content = fs.readFileSync(filePath, "utf-8");

  // Skip if already added
  if (content.includes("const [sessionProfit, setSessionProfit]")) {
    console.log(`Skipping ${file}, already has sessionProfit`);
    continue;
  }

  // Inject state: const [loading, setLoading] = useState(false); -> add sessionProfit
  content = content.replace(
    /const \[loading, setLoading\] = useState\(false\);/,
    `const [loading, setLoading] = useState(false);\n  const [sessionProfit, setSessionProfit] = useState(0);`,
  );

  // Special games where betAmount is what they subtract
  // We look for setBalance(data.newBalance); and add setSessionProfit
  // We need to know what the bet variable is named. In our games, it is `bet`.
  content = content.replace(
    /setBalance\(data\.newBalance\);/,
    `setBalance(data.newBalance);\n        setSessionProfit(prev => prev + (data.winAmount - bet));`,
  );

  // Inject prop to BetControls
  content = content.replace(
    /<BetControls bet={bet} setBet={setBet} loading={loading} \/>/g,
    `<BetControls bet={bet} setBet={setBet} loading={loading} sessionProfit={sessionProfit} />`,
  );

  content = content.replace(
    /<BetControls bet={bet} setBet={setBet} loading={loading}\/>/g,
    `<BetControls bet={bet} setBet={setBet} loading={loading} sessionProfit={sessionProfit} />`,
  );

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Injected sessionProfit into ${file}`);
}
