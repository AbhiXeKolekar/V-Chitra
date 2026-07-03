export type GameState = {
  drawerId: string;
  drawerName: string;

  wordLength: number;

  timeLeft: number;

  currentRound: number;
  totalRounds: number;
};

export type DrawerData = {
  drawerId: string;
  word: string;
};