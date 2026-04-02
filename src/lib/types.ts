// 大会結果1件
export type TournamentResult = {
  id: string;
  date: string; // "2026-04-02"
  eventType: "store" | "flagship" | "cs" | "other";
  storeName?: string;
  region?: string;
  placement: number; // 1=優勝, 2=準優勝...
  deckName: string; // "紫エネル"
  leaderCard?: string; // "OP09-056 エネル"
  playerName?: string;
  sourceUrl?: string; // X投稿URL
};

// Tier表エントリ
export type TierEntry = {
  deckName: string;
  tier: "S" | "A" | "B" | "C";
  color: string; // デッキカラー (red, blue, green, purple, black, yellow, multi)
  winRate?: number;
  usageRate?: number;
  trend: "up" | "down" | "stable" | "new";
  previousTier?: string;
  description?: string;
};

// 相性データ
export type MatchupEntry = {
  deck1: string;
  deck2: string;
  winRate: number; // deck1の勝率 (0-100)
  sampleSize: number;
};

// メタ推移データ（週別）
export type MetaWeekly = {
  week: string; // "3月第1週"
  weekStart: string; // "2026-03-03"
  data: {
    deckName: string;
    usageRate: number; // 使用率 (%)
    winCount: number;
  }[];
};

// デッキカラーマッピング
export const DECK_COLORS: Record<string, string> = {
  "空島ルフィ": "#22c55e", // green-500
  "紫エネル": "#a855f7", // purple-500
  "赤青ルーシー": "#3b82f6", // blue-500
  "黒黄モリア": "#eab308", // yellow-500
  "黒イム": "#6b7280", // gray-500
  "黒ティーチ": "#374151", // gray-700
  "緑紫ルフィ": "#10b981", // emerald-500
  "黄カルガラ": "#f59e0b", // amber-500
  "赤紫ロジャー": "#ef4444", // red-500
  "赤黄ボニー": "#f97316", // orange-500
  "青黄エース": "#06b6d4", // cyan-500
  "黄エネル": "#fbbf24", // amber-400
  "緑ミホーク": "#16a34a", // green-600
  "赤紫シュガー": "#ec4899", // pink-500
  "赤緑クリーク": "#84cc16", // lime-500
  "青黄ナミ": "#8b5cf6", // violet-500
  "むらさきエネル": "#7c3aed", // violet-600
};
