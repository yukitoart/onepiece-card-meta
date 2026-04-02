import Link from "next/link";
import TierList from "@/components/TierList";
import ResultsTable from "@/components/ResultsTable";
import { getTierList, getResults, getWinCountByDeck } from "@/lib/data";
import { DECK_COLORS } from "@/lib/types";

export default function Home() {
  const tier = getTierList();
  const results = getResults();
  const winCounts = getWinCountByDeck();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* ヒーロー */}
      <section className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold">
          🏴‍☠️ ワンピカ<span className="text-red-500">META</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          ワンピースカードゲームの店舗予選・フラッグシップバトル優勝デッキを毎日集計。
          環境Tier表・メタ推移・デッキ相性を分析してお届けします。
        </p>
        <p className="text-sm text-gray-500">
          最終更新: 2026年4月2日 | データ件数: {results.length}件
        </p>
      </section>

      {/* 優勝デッキ分布（バー） */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          📊 優勝デッキ分布
        </h2>
        <div className="space-y-2">
          {winCounts.slice(0, 8).map((item) => {
            const maxCount = winCounts[0]?.count || 1;
            const pct = (item.count / maxCount) * 100;
            return (
              <div key={item.deckName} className="flex items-center gap-3">
                <span className="w-28 text-sm text-gray-300 text-right shrink-0">
                  {item.deckName}
                </span>
                <div className="flex-1 bg-gray-800 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-2 text-xs font-bold text-white transition-all"
                    style={{
                      width: `${Math.max(pct, 15)}%`,
                      backgroundColor: DECK_COLORS[item.deckName] || "#6b7280",
                    }}
                  >
                    {item.count}勝
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tier表 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🏆 環境Tier表 <span className="text-sm font-normal text-gray-400">3月第5週</span>
          </h2>
        </div>
        <TierList data={tier} />
      </section>

      {/* 最新大会結果 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🗓️ 最新の大会結果
          </h2>
          <Link
            href="/results"
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            すべて見る →
          </Link>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <ResultsTable data={results} limit={7} />
        </div>
      </section>
    </div>
  );
}
