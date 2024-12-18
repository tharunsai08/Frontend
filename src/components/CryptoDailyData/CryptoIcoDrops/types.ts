// src/components/CryptoDailyData/CryptoIcoDrops/types.ts

export interface SocialLinks {
    linkedin?: string | null;
    twitter?: string | null;
    telegram_chat?: string | null;
    github?: string | null;
    discord?: string | null;
    reddit?: string | null;
    youtube?: string | null;
    other?: string | null;
  }
  
  export interface IcoData {
    id: string; // Add this line to uniquely identify each ICO
    date: string;
    project: string;
    ticker: string;
    overview: string;
    round: string;
    total_raised: string;
    pre_valuation: string;
    total_rounds: number;
    investors: string;
    ecosystem: string;
    token_type: string;
    categories: string;
    listing_date: string;
    project_website: string;
    whitepaper: string;
    source: string;
    social_links: SocialLinks;
  }
  