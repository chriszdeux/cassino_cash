const fs = require("fs");
const path = require("path");

const gamesDir = path.resolve("./components/games");
const files = fs.readdirSync(gamesDir).filter((f) => f.endsWith(".tsx"));

for (const file of files) {
  const filePath = path.join(gamesDir, file);
  let content = fs.readFileSync(filePath, "utf-8");

  // Buttons
  content = content.replace(/"SPIN!"/g, '"¡GIRAR!"');
  content = content.replace(/"SPINNING..."/g, '"GIRANDO..."');

  content = content.replace(/"ROLL!"/g, '"¡TIRAR DADOS!"');
  content = content.replace(/"ROLLING..."/g, '"TIRANDO..."');

  content = content.replace(/"PLAY!"/g, '"¡JUGAR!"');
  content = content.replace(/"PLAYING..."/g, '"JUGANDO..."');
  content = content.replace(/"PLAYING"/g, '"JUGANDO"');

  content = content.replace(/"FLIP!"/g, '"¡LANZAR!"');
  content = content.replace(/"FLIPPING..."/g, '"LANZANDO..."');

  content = content.replace(/"PICK!"/g, '"¡ELEGIR!"');
  content = content.replace(/"PICKING..."/g, '"ELIGIENDO..."');

  content = content.replace(/"MINE!"/g, '"¡MINAR!"');
  content = content.replace(/"MINING..."/g, '"MINANDO..."');

  content = content.replace(/"GUESS!"/g, '"¡ADIVINAR!"');
  content = content.replace(/"GUESSING..."/g, '"ADIVINANDO..."');

  content = content.replace(/"CASH OUT"/g, '"RETIRAR"');
  content = content.replace(/"CASHING OUT..."/gi, '"RETIRANDO..."');

  content = content.replace(/"LAUNCH"/g, '"DESPEGAR"');
  content = content.replace(/"FLYING..."/g, '"VOLANDO..."');

  content = content.replace(/>SPIN!</g, ">¡GIRAR!<");
  content = content.replace(/>SPINNING\.\.\.</g, ">GIRANDO...<");
  content = content.replace(/>ROLL!</g, ">¡TIRAR DADOS!<");
  content = content.replace(/>ROLLING\.\.\.</g, ">TIRANDO...<");
  content = content.replace(/>PLAY!</g, ">¡JUGAR!<");
  content = content.replace(/>PLAYING\.\.\.</g, ">JUGANDO...<");
  content = content.replace(/>FLIP!</g, ">¡LANZAR!<");
  content = content.replace(/>FLIPPING\.\.\.</g, ">LANZANDO...<");
  content = content.replace(/>PICK!</g, ">¡ELEGIR!<");
  content = content.replace(/>PICKING\.\.\.</g, ">ELIGIENDO...<");
  content = content.replace(/>MINE!</g, ">¡MINAR!<");
  content = content.replace(/>MINING\.\.\.</g, ">MINANDO...<");
  content = content.replace(/>GUESS!</g, ">¡ADIVINAR!<");
  content = content.replace(/>GUESSING\.\.\.</g, ">ADIVINANDO...<");

  content = content.replace(/>CASH OUT(.*?)</gi, ">RETIRAR$1<");
  content = content.replace(/CASHING OUT\.\.\./gi, "RETIRANDO...");
  content = content.replace(/Out At/g, "Retirar en");
  content = content.replace(/>Current Signal/g, ">Señal Actual");
  content = content.replace(/>Next Signal/g, ">Siguiente Señal");
  content = content.replace(/>Multiplier/g, ">Multiplicador");
  content = content.replace(/>Step (.*?)</g, ">Paso $1<");
  content = content.replace(/>Mines:(.*?)</g, ">Minas:$1<");
  content = content.replace(/>Safe:(.*?)</g, ">Seguros:$1<");
  content = content.replace(/"Safe crystal!"/g, '"¡Cristal seguro!"');
  content = content.replace(/"You hit a bomb!"/g, '"¡Explotó una bomba!"');

  fs.writeFileSync(filePath, content, "utf-8");
}
console.log("All UI states translated");
