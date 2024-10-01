export interface Pixel {
  x: number;
  y: number;
  color: string;
}

export interface IncomingMessage {
  type: string;
  payload: Pixel[];
}