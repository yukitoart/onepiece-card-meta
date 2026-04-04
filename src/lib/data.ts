import tierData from "@/data/tier.json";
import resultsData from "@/data/results.json";
import matchupData from "@/data/matchup.json";
import metaWeeklyData from "@/data/meta-weekly.json";
import deckRecipesData from "@/data/deck-recipes.json";
import type { TierEntry, TournamentResult, MatchupEntry, MetaWeekly, DeckRecipe } from "./types";

export function getTierList(): TierEntry[] {
  return tierData as TierEntry[];
}

export function getResults(): TournamentResult[] {
  return (resultsData as TournamentResult[]).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getMatchups(): MatchupEntry[] {
  return matchupData as MatchupEntry[];
}

export function getMetaWeekly(): MetaWeekly[] {
  return metaWeeklyData as MetaWeekly[];
}

// デッキレシピ取得
export function getDeckRecipes(): DeckRecipe[] {
  return (deckRecipesData as DeckRecipe[]).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// デッキ別優勝数集計
export function getWinCountByDeck(): { deckName: string; count: number }[] {
  const results = getResults();
  const countMap = new Map<string, number>();
  for (const r of results) {
    if (r.placement === 1) {
      countMap.set(r.deckName, (countMap.get(r.deckName) || 0) + 1);
    }
  }
  return Array.from(countMap.entries())
    .map(([deckName, count]) => ({ deckName, count }))
    .sort((a, b) => b.count - a.count);
}
