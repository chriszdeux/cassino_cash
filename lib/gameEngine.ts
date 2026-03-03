import { PlayRequest, PlayResponse } from "@/types/game";

export async function playGameLocally(request: PlayRequest): Promise<PlayResponse> {
  const { gameId, betAmount, payload, currentBalance } = request;

  if (!gameId || typeof betAmount !== 'number' || betAmount <= 0) {
    throw new Error("Invalid request payload");
  }

  if (currentBalance < betAmount) {
    throw new Error("Insufficient balance");
  }

  let winAmount = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let resultData: any = {};
  
  // Process game logic locally (mocking backend validation)
  switch(gameId) {
    case 'neon-slots':
      const symbols = ['🍒', '🍋', '⭐', '💎', '7️⃣'];
      const s1 = symbols[Math.floor(Math.random() * symbols.length)];
      const s2 = symbols[Math.floor(Math.random() * symbols.length)];
      const s3 = Math.random() > 0.8 ? s1 : symbols[Math.floor(Math.random() * symbols.length)];
      
      resultData = { symbols: [s1, s2, s3] };

      if (s1 === s2 && s2 === s3) {
        winAmount = betAmount * 10;
        resultData.outcome = "jackpot";
      } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        winAmount = betAmount * 2;
        resultData.outcome = "win";
      } else {
        winAmount = 0;
        resultData.outcome = "lose";
      }
      break;

    case 'cyber-roulette':
      const outcomeNumber = Math.floor(Math.random() * 37);
      const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(outcomeNumber);
      const outcomeColor = outcomeNumber === 0 ? 'verde' : (isRed ? 'rojo' : 'negro');
      const isEve = outcomeNumber !== 0 && outcomeNumber % 2 === 0;

      resultData = { outcomeNumber, outcomeColor };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rtPayload: any = payload;

      if (rtPayload?.betType === outcomeColor) {
         winAmount = betAmount * 2;
         resultData.outcome = "win";
      } else if (rtPayload?.betType === 'par' && isEve) {
         winAmount = betAmount * 2;
         resultData.outcome = "win";
      } else if (rtPayload?.betType === 'impar' && !isEve && outcomeNumber !== 0) {
         winAmount = betAmount * 2;
         resultData.outcome = "win";
      } else {
         winAmount = 0;
         resultData.outcome = "lose";
      }
      break;

    case 'crystal-burst':
      const isBomb = Math.random() < 0.2;
      if (isBomb) {
        winAmount = 0;
        resultData = { outcome: 'lose', message: 'You hit a bomb!' };
      } else {
        winAmount = betAmount * 1.5;
        resultData = { outcome: 'win', message: 'Safe crystal!' };
      }
      break;

    case 'binary-flip':
      const coin = Math.random() < 0.5 ? 'cara' : 'cruz';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bfPayload: any = payload;
      if (bfPayload?.choice === coin) {
        winAmount = betAmount * 1.9;
        resultData = { outcome: 'win', coin };
      } else {
        winAmount = 0;
        resultData = { outcome: 'lose', coin };
      }
      break;

    case 'turbo-dice':
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;
      let dOutcome = 'lose';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tdPayload: any = payload;
      if (tdPayload?.guess === 'siete' && sum === 7) {
        winAmount = betAmount * 4;
        dOutcome = 'win';
      } else if (tdPayload?.guess === 'bajo' && sum >= 2 && sum <= 6) {
        winAmount = betAmount * 2;
        dOutcome = 'win';
      } else if (tdPayload?.guess === 'alto' && sum >= 8 && sum <= 12) {
        winAmount = betAmount * 2;
        dOutcome = 'win';
      } else {
        winAmount = 0;
      }
      resultData = { outcome: dOutcome, dice: [d1, d2], sum };
      break;

    case 'void-crash':
      const crashPoint = 1 + (Math.random() * 4);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vcPayload: any = payload;
      const tgt = vcPayload?.targetMultiplier || 1.1;
      if (tgt <= crashPoint) {
        winAmount = betAmount * tgt;
        resultData = { outcome: 'win', crashPoint };
      } else {
        winAmount = 0;
        resultData = { outcome: 'lose', crashPoint };
      }
      break;

    case 'pulse-match':
      const winningIndex = Math.floor(Math.random() * 3);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pmPayload: any = payload;
      if (pmPayload?.cardIndex === winningIndex) {
        winAmount = betAmount * 2.5; 
        resultData = { outcome: 'win', winningIndex };
      } else {
        winAmount = 0;
        resultData = { outcome: 'lose', winningIndex };
      }
      break;

    case 'quick-ladder':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const qlPayload: any = payload;
      const risk = qlPayload?.step || 1; 
      const chance = 1 - (risk * 0.1); 
      if (Math.random() < chance) {
        winAmount = betAmount * (1 + risk * 0.2); 
        resultData = { outcome: 'win', step: risk };
      } else {
        winAmount = 0;
        resultData = { outcome: 'lose', step: risk, crashed: true };
      }
      break;

    case 'orb-miner':
      const orbMiss = Math.random() < 0.25;
      if (!orbMiss) {
        winAmount = betAmount * 1.25;
        resultData = { outcome: 'win' };
      } else {
        winAmount = 0;
        resultData = { outcome: 'lose' };
      }
      break;

    case 'signal-guess':
      const nextSignal = Math.floor(Math.random() * 100);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sgPayload: any = payload;
      const cur = sgPayload?.currentSignal || 50;
      const isHigher = nextSignal >= cur;
      if ((sgPayload?.guess === 'mayor' && isHigher) || (sgPayload?.guess === 'menor' && !isHigher)) {
        winAmount = betAmount * 1.8;
        resultData = { outcome: 'win', nextSignal };
      } else {
        winAmount = 0;
        resultData = { outcome: 'lose', nextSignal };
      }
      break;

    default:
      const isWinner = Math.random() < 0.4;
      if (isWinner) {
        winAmount = betAmount * 2;
        resultData = { outcome: "win", multiplier: 2 };
      } else {
        winAmount = 0;
        resultData = { outcome: "lose", multiplier: 0 };
      }
  }
  
  const balanceChange = winAmount - betAmount;
  const computedNewBalance = currentBalance + balanceChange;
  
  const response: PlayResponse = {
    success: true,
    gameId,
    betAmount,
    winAmount,
    newBalance: computedNewBalance,
    resultData,
  };

  await new Promise(r => setTimeout(r, 600));

  return response;
}
