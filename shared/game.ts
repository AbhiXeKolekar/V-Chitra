export type GameState = {
  drawerId: string;
  drawerName: string;

  wordLength: number;

  timeLeft: number;

  currentRound: number;
  totalRounds: number;
};

export type FinalScore = {
  playerId: string;
  username: string;
  score: number;
};

export type DrawerData = {
  drawerId: string;
  word: string;
};