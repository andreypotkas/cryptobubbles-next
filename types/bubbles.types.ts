import { Text } from "pixi.js";

export enum PriceChangePercentage {
  HOUR = "price_change_percentage_1h_in_currency",
  DAY = "price_change_percentage_24h_in_currency",
  WEEK = "price_change_percentage_7d_in_currency",
  MONTH = "price_change_percentage_30d_in_currency",
  YEAR = "price_change_percentage_1y_in_currency",
}

export type Circle = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  dragging: boolean;
  targetRadius: number;
  symbol: string;
  coinName: string;
  radius: number;
  [PriceChangePercentage.HOUR]: number;
  [PriceChangePercentage.DAY]: number;
  [PriceChangePercentage.WEEK]: number;
  [PriceChangePercentage.MONTH]: number;
  [PriceChangePercentage.YEAR]: number;
  image: string;
  text2: Text | null;
};
