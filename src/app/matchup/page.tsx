import MatchupMatrix from "@/components/MatchupMatrix";
import { getMatchups } from "@/lib/data";

export const metadata = {
  title: "デッキ相性表 | ワンピカMETA",
  description: "ワンピースカードゲームの主要デッキ間の相性マトリクス",
};

export default function MatchupPage() {
  const matchups = getMatchups();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">⚔️ デッキ相性マトリクス</h1>
        <p className="text-gray-400 mt-1">
          主要デッキ間の勝率を表示。行のデッキから見た勝率です。
        </p>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 sm:p-6">
        <div className="flex flex-wrap gap-4 mb-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-green-600/80" />
            <span className="text-gray-400">有利 (60%+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-green-800/60" />
            <span className="text-gray-400">やや有利 (55-59%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-gray-700/60" />
            <span className="text-gray-400">五分 (45-54%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-red-800/60" />
            <span className="text-gray-400">やや不利 (40-44%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-red-600/80" />
            <span className="text-gray-400">不利 (39%-)</span>
          </div>
        </div>
        <MatchupMatrix data={matchups} />
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 sm:p-6">
        <h2 className="text-lg font-bold mb-3">📝 相性の読み方</h2>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>
            • 数値は<span className="text-white font-medium">行のデッキ</span>から見た勝率（%）
          </li>
          <li>• サンプル数が少ないデータは参考値です</li>
          <li>• データはPROS記事・大会結果・プレイヤー報告を基に集計</li>
          <li>• 先攻/後攻の選択や構築差で変動します</li>
        </ul>
      </div>
    </div>
  );
}
