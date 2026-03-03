const fs = require("fs");
const path = require("path");
const gamesDir = path.resolve("./components/games");
const files = fs.readdirSync(gamesDir).filter((f) => f.endsWith(".tsx"));

for (const file of files) {
  const filePath = path.join(gamesDir, file);
  let content = fs.readFileSync(filePath, "utf8");

  // Add import if missing
  if (!content.includes("playGameLocally")) {
    content = content.replace(
      'import { PlayRequest, PlayResponse } from "@/types/game";',
      'import { PlayRequest, PlayResponse } from "@/types/game";\nimport { playGameLocally } from "@/lib/gameEngine";',
    );
  }

  // Replace fetch with local call
  const fetchRegex =
    /const response = await fetch\("\/api\/game\/play", {\s*method: "POST",\s*headers: { "Content-Type": "application\/json" },\s*body: JSON.stringify\(([\s\S]*?) as PlayRequest\),\s*}\);\s*const data: PlayResponse = await response.json\(\);/gm;

  if (fetchRegex.test(content)) {
    content = content.replace(
      fetchRegex,
      "const request = $1 as PlayRequest;\n      const data: PlayResponse = await playGameLocally(request);",
    );
  }

  // Handle any other variations if someone used another style (e.g., let data = await response.json())

  fs.writeFileSync(filePath, content);
}

console.log("Updated minigames to local execution");
