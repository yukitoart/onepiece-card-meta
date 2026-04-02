import ResultsTable from "@/components/ResultsTable";
import { getResults } from "@/lib/data";

export const metadata = {
  title: "大会結果一覧 | ワンピカMETA",
  description: "ワンピースカードゲーム 店舗予選・フラッグシップバトル優勝結果一覧",
};

export default function ResultsPage() {
  const results = getResults();

  // イベントタイプ別集計
  const storeCount = results.filter((r) => r.eventType === "store").length;
  const flagshipCount = results.filter((r) => r.eventType === "flagship").length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">🗓️ 大会結果一覧</h1>
        <p className="text-gray-400 mt-1">
          店舗予選・フラッグシップバトルの優勝結果を新しい順に表示
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-white">{results.length}</p>
          <p className="text-xs text-gray-400 mt-1">総データ件数</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{storeCount}</p>
          <p className="text-xs text-gray-400 mt-1">店舗予選</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-purple-400">{flagshipCount}</p>
          <p className="text-xs text-gray-400 mt-1">フラッグシップ</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-green-400">
            {new Set(results.map((r) => r.deckName)).size}
          </p>
          <p className="text-xs text-gray-400 mt-1">デッキ種類</p>
        </div>
      </div>

      {/* 結果テーブル */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <ResultsTable data={results} />
      </div>
    </div>
  );
}
