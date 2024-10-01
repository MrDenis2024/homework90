export interface Draw {
  x: number;
  y: number;
  color: string;
}

export interface IncomingDraw {
  type: string;
  payload: Draw[];
}