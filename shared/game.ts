export type GameState = {
  drawerId: string;
  drawerName: string;
  wordLength: number;
  timeLeft: number;
};

export type DrawerData = {
  drawerId: string;
  word: string;
};