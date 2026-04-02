import type { TournamentResult } from "@/lib/types";
import { DECK_COLORS } from "@/lib/types";

const eventTypeLabels: Record<string, { label: string; color: string }> = {
  store: { label: "店舗予選", color: "bg-blue-900 text-blue-300" },
  flagship: { label: "フラシ", color: "bg-purple-900 text-purple-300" },
  cs: { label: "CS", color: "bg-red-900 text-red-300" },
  other: { label: "その他", color: "bg-gray-700 text-gray-300" },
};

export default function ResultsTable({
  data,
  limit,
}: {
  data: TournamentResult[];
  limit?: number;
}) {
  const display = limit ? data.slice(0, limit) : data;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700 text-gray-400 text-left">
            <th className="py-3 px-2">日付</th>
            <th className="py-3 px-2">大会</th>
            <th className="py-3 px-2">デッキ</th>
            <th className="py-3 px-2 hidden sm:table-cell">地域</th>
            <th className="py-3 px-2 hidden md:table-cell">プレイヤー</th>
          </tr>
        </thead>
        <tbody>
          {display.map((r) => {
            const et = eventTypeLabels[r.eventType] || eventTypeLabels.other;
            return (
              <tr
                key={r.id}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-3 px-2 text-gray-300 whitespace-nowrap">
                  {r.date.slice(5)}
                </td>
                <td className="py-3 px-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${et.color}`}
                  >
                    {et.label}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          DECK_COLORS[r.deckName] || "#6b7280",
                      }}
                    />
                    <span className="text-white font-medium">{r.deckName}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-gray-400 hidden sm:table-cell">
                  {r.region || "-"}
                </td>
                <td className="py-3 px-2 text-gray-400 hidden md:table-cell">
                  {r.playerName || "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
