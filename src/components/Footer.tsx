export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900/50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              🏴‍☠️ ワンピカMETA — ワンピースカードゲーム メタ分析サイト
            </p>
            <p className="text-gray-500 text-xs mt-1">
              店舗予選・フラッグシップバトルの優勝デッキデータを集計・分析
            </p>
          </div>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>データ更新: 毎日</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-800 text-center">
          <p className="text-gray-600 text-xs">
            当サイトはファン運営の非公式サイトです。ONE PIECEカードゲームはBANDAI社の商品です。
          </p>
        </div>
      </div>
    </footer>
  );
}
