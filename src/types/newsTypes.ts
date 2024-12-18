// src/types/newsTypes.ts

export interface NewsItem {
    id: number;
    date: string;
    ticker: string;
    heading: string | null;
    description: string | null;
  }
  