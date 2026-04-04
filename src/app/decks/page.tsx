import { getDeckRecipes } from "@/lib/data";
import { DECK_COLORS } from "@/lib/types";
import type { DeckCard, DeckRecipe } from "@/lib/types";

// イベント種別の日本語ラベル
const EVENT_LABELS: Record<string, string> = {
  flagship: "フラッグシップ",
  championship: "チャンピオンシップ",
  store: "店舗大会",
  other: "その他",
};

// カテゴリの日本語ラベル
const CATEGORY_LABELS: Record<string, string> = {
  character: "キャラクター",
  event: "イベント",
  stage: "ステージ",
};

// カテゴリのアイコン
const CATEGORY_ICONS: Record<string, string> = {
  character: "⚔️",
  event: "⚡",
  stage: "🗺️",
};

function DeckColorBadge({ deckType }: { deckType: string }) {
  const color = DECK_COLORS[deckType] ?? "#6b7280";
  return (
    <span
      className="inline-block w-3 h-3 rounded-full mr-1 flex-shrink-0"
      style={{ backgroundColor: color }}
    />
  );
}

function CardRow({ card }: { card: DeckCard }) {
  return (
    <div className="flex items-center justify-between py-1.5 px-3 rounded hover:bg-gray-700/50 transition-colors">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs font-mono text-gray-500 flex-shrink-0 w-20">
          {card.cardId}
        </span>
        <span className="text-sm text-white truncate">{card.name}</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 ml-2">
        {card.cost !== null && (
          <span className="text-xs text-gray-400">
            コスト<span className="text-yellow-400 font-bold ml-0.5">{card.cost}</span>
          </span>
        )}
        {card.power !== null && (
          <span className="text-xs text-gray-400">
            <span className="text-blue-400 font-bold">{card.power.toLocaleString()}</span>
          </span>
        )}
        <span className="text-sm font-bold text-white w-6 text-right">
          ×{card.count}
        </span>
      </div>
    </div>
  );
}

function DeckRecipeCard({ recipe }: { recipe: DeckRecipe }) {
  const color = DECK_COLORS[recipe.deckType] ?? "#6b7280";

  // カテゴリ別に分類
  const characters = recipe.mainDeck
    .filter((c) => c.category === "character")
    .sort((a, b) => (a.cost ?? 99) - (b.cost ?? 99));
  const events = recipe.mainDeck
    .filter((c) => c.category === "event")
    .sort((a, b) => (b.cost ?? 0) - (a.cost ?? 0));
  const stages = recipe.mainDeck.filter((c) => c.category === "stage");

  const totalCharacters = characters.reduce((s, c) => s + c.count, 0);
  const totalEvents = events.reduce((s, c) => s + c.count, 0);
  const totalStages = stages.reduce((s, c) => s + c.count, 0);

  const eventLabel = EVENT_LABELS[recipe.eventType] ?? recipe.eventType;

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      {/* ヘッダー */}
      <div
        className="px-5 py-4"
        style={{ borderLeft: `4px solid ${color}` }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DeckColorBadge deckType={recipe.deckType} />
              <h2 className="text-lg font-bold text-white">{recipe.deckType}</h2>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-gray-400">
              <span>{recipe.date}</span>
              <span className="bg-gray-700 px-2 py-0.5 rounded">{eventLabel}</span>
              {recipe.playerName && (
                <span className="text-gray-300">👤 {recipe.playerName}</span>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-bold text-white">{recipe.totalCards}</div>
            <div className="text-xs text-gray-500">枚</div>
          </div>
        </div>

        {/* リーダー */}
        <div className="mt-3 flex items-center gap-2 bg-gray-700/50 rounded-lg px-3 py-2">
          <span className="text-xs text-gray-400">リーダー</span>
          <span className="text-xs font-mono text-gray-500">{recipe.leader.cardId}</span>
          <span className="text-sm font-bold text-white">{recipe.leader.name}</span>
        </div>
      </div>

      {/* カードリスト */}
      <div className="divide-y divide-gray-700/50">
        {/* キャラクター */}
        {characters.length > 0 && (
          <div className="px-2 py-3">
            <div className="flex items-center gap-2 px-3 mb-1">
              <span className="text-xs font-bold text-gray-400">
                {CATEGORY_ICONS.character} {CATEGORY_LABELS.character}
              </span>
              <span className="text-xs text-gray-500">{totalCharacters}枚</span>
            </div>
            {characters.map((card) => (
              <CardRow key={card.cardId} card={card} />
            ))}
          </div>
        )}

        {/* イベント */}
        {events.length > 0 && (
          <div className="px-2 py-3">
            <div className="flex items-center gap-2 px-3 mb-1">
              <span className="text-xs font-bold text-gray-400">
                {CATEGORY_ICONS.event} {CATEGORY_LABELS.event}
              </span>
              <span className="text-xs text-gray-500">{totalEvents}枚</span>
            </div>
            {events.map((card) => (
              <CardRow key={card.cardId} card={card} />
            ))}
          </div>
        )}

        {/* ステージ */}
        {stages.length > 0 && (
          <div className="px-2 py-3">
            <div className="flex items-center gap-2 px-3 mb-1">
              <span className="text-xs font-bold text-gray-400">
                {CATEGORY_ICONS.stage} {CATEGORY_LABELS.stage}
              </span>
              <span className="text-xs text-gray-500">{totalStages}枚</span>
            </div>
            {stages.map((card) => (
              <CardRow key={card.cardId} card={card} />
            ))}
          </div>
        )}
      </div>

      {/* フッター */}
      <div className="px-5 py-3 bg-gray-900/40 flex items-center justify-between">
        <div className="flex gap-3 text-xs text-gray-500">
          <span>キャラ {totalCharacters}枚</span>
          <span>イベント {totalEvents}枚</span>
          {totalStages > 0 && <span>ステージ {totalStages}枚</span>}
        </div>
        {recipe.source && (
          <a
            href={recipe.source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            元画像 →
          </a>
        )}
      </div>
    </div>
  );
}

export default function DecksPage() {
  const recipes = getDeckRecipes();

  // デッキタイプ別にグループ化
  const grouped = recipes.reduce<Record<string, DeckRecipe[]>>((acc, r) => {
    if (!acc[r.deckType]) acc[r.deckType] = [];
    acc[r.deckType].push(r);
    return acc;
  }, {});

  const deckTypes = Object.keys(grouped);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* ページヘッダー */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">🃏 デッキレシピ</h1>
        <p className="text-gray-400 text-sm">
          大会入賞デッキの採用カード・枚数を収録しています。
        </p>
        <div className="mt-3 flex gap-4 text-sm text-gray-500">
          <span>{recipes.length}件のレシピ</span>
          <span>{deckTypes.length}種類のデッキ</span>
        </div>
      </div>

      {/* デッキタイプ絞り込みタブ（将来拡張用） */}
      <div className="flex flex-wrap gap-2 mb-6">
        {deckTypes.map((deckType) => {
          const color = DECK_COLORS[deckType] ?? "#6b7280";
          return (
            <a
              key={deckType}
              href={`#deck-${deckType}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300 hover:text-white transition-colors border border-gray-700"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              {deckType}
              <span className="text-gray-500">({grouped[deckType].length})</span>
            </a>
          );
        })}
      </div>

      {/* デッキレシピ一覧 */}
      <div className="space-y-10">
        {deckTypes.map((deckType) => (
          <section key={deckType} id={`deck-${deckType}`}>
            <div className="flex items-center gap-2 mb-4">
              <DeckColorBadge deckType={deckType} />
              <h2 className="text-lg font-bold text-white">{deckType}</h2>
              <span className="text-sm text-gray-500">
                {grouped[deckType].length}件
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {grouped[deckType].map((recipe) => (
                <DeckRecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
