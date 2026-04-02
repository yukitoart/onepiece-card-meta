import type { TierEntry } from "@/lib/types";
import { DECK_COLORS } from "@/lib/types";

const tierConfig: Record<string, { label: string; bg: string; border: string }> = {
  S: { label: "Tier S", bg: "bg-red-950/50", border: "border-red-800" },
  A: { label: "Tier A", bg: "bg-orange-950/50", border: "border-orange-800" },
  B: { label: "Tier B", bg: "bg-blue-950/50", border: "border-blue-800" },
  C: { label: "Tier C", bg: "bg-gray-800/50", border: "border-gray-700" },
};

const trendIcons: Record<string, string> = {
  up: "↑",
  down: "↓",
  stable: "→",
  new: "★",
};

const trendColors: Record<string, string> = {
  up: "text-green-400",
  down: "text-red-400",
  stable: "text-gray-400",
  new: "text-yellow-400",
};

export default function TierList({ data }: { data: TierEntry[] }) {
  const grouped = data.reduce<Record<string, TierEntry[]>>((acc, entry) => {
    if (!acc[entry.tier]) acc[entry.tier] = [];
    acc[entry.tier].push(entry);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {(["S", "A", "B", "C"] as const).map((tier) => {
        const entries = grouped[tier];
        if (!entries || entries.length === 0) return null;
        const config = tierConfig[tier];
        return (
          <div
            key={tier}
            className={`rounded-xl border ${config.border} ${config.bg} overflow-hidden`}
          >
            <div className="px-4 py-2 border-b border-gray-800/50">
              <h3 className="font-bold text-white">{config.label}</h3>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {entries.map((entry) => (
                <div
                  key={entry.deckName}
                  className="bg-gray-800/60 rounded-lg p-3 flex items-center justify-between hover:bg-gray-700/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: DECK_COLORS[entry.deckName] || "#6b7280" }}
                    />
                    <div>
                      <p className="font-medium text-white text-sm">{entry.deckName}</p>
                      {entry.usageRate && (
                        <p className="text-xs text-gray-400">使用率 {entry.usageRate}%</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg ${trendColors[entry.trend]}`}>
                      {trendIcons[entry.trend]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
