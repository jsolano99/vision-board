import { Category } from "@/lib/categories";

export type BoardImage = {
  id: string;
  url: string;
  x: number;
  y: number;
  rotation: number;
  category: Category;
};

export const CARD_SIZE = 132;
