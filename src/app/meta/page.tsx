import MetaChart from "@/components/MetaChart";
import { getMetaWeekly } from "@/lib/data";

export const metadata = {
  title: "メタ推移 | ワンピカMETA",
  description: "ワンピースカードゲームの週別デッキ使用率推移グラフ",
};

export default function MetaPage() {
  const metaData = getMetaWeekly();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">📈 メタ推移グラフ</h1>
        <p className="text-gray-400 mt-1">
          週別のデッキ使用率（優勝回数ベース）の推移を表示します
        </p>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 sm:p-6">
        <h2 className="text-lg font-bold mb-4">デッキ使用率推移（3月）</h2>
        <MetaChart data={metaData} />
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 sm:p-6">
        <h2 className="text-lg font-bold mb-4">📝 環境考察メモ</h2>
        <div className="space-y-3 text-sm text-gray-300">
          <p>
            <span className="text-green-400 font-bold">空島ルフィ</span>と
            <span className="text-purple-400 font-bold">紫エネル</span>の2強環境が継続。
            紫エネルは3月を通じて使用率が10.5%→16.2%と急上昇し、Tier1に昇格。
          </p>
          <p>
            <span className="text-yellow-400 font-bold">黒黄モリア</span>（ループデッキ）、
            <span className="text-gray-300 font-bold">黒イム</span>、
            <span className="font-bold">黒ティーチ</span>の黒系デッキが台頭。
            特に黒ティーチはTier2.5→Tier1.5へ大幅上昇。
          </p>
          <p>
            <span className="text-amber-400 font-bold">黄カルガラ</span>は
            Tier1.5→Tier2に下落。黒系デッキの増加が逆風に。
          </p>
        </div>
      </div>
    </div>
  );
}
