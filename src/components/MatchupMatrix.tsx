"use client";
import type { MatchupEntry } from "@/lib/types";

function getColor(rate: number): string {
  if (rate >= 60) return "bg-green-600/80 text-white";
  if (rate >= 55) return "bg-green-800/60 text-green-200";
  if (rate >= 45) return "bg-gray-700/60 text-gray-300";
  if (rate >= 40) return "bg-red-800/60 text-red-200";
  return "bg-red-600/80 text-white";
}

export default function MatchupMatrix({ data }: { data: MatchupEntry[] }) {
  // デッキリストを抽出
  const deckSet = new Set<string>();
  data.forEach((m) => {
    deckSet.add(m.deck1);
    deckSet.add(m.deck2);
  });
  const decks = Array.from(deckSet);

  // マトリクス用のマップを構築
  const rateMap = new Map<string, number>();
  data.forEach((m) => {
    rateMap.set(`${m.deck1}|${m.deck2}`, m.winRate);
    rateMap.set(`${m.deck2}|${m.deck1}`, 100 - m.winRate);
  });

  return (
    <div className="overflow-x-auto">
      <table className="text-xs sm:text-sm min-w-[600px]">
        <thead>
          <tr>
            <th className="p-2 text-gray-400 text-left sticky left-0 bg-gray-900 z-10 min-w-[100px]">
              デッキ ↓ vs →
            </th>
            {decks.map((d) => (
              <th
                key={d}
                className="p-2 text-gray-400 font-medium text-center whitespace-nowrap"
                style={{ writingMode: "vertical-rl", height: "100px" }}
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {decks.map((row) => (
            <tr key={row} className="border-t border-gray-800">
              <td className="p-2 text-white font-medium whitespace-nowrap sticky left-0 bg-gray-900 z-10">
                {row}
              </td>
              {decks.map((col) => {
                if (row === col) {
                  return (
                    <td key={col} className="p-2 text-center bg-gray-800/30">
                      <span className="text-gray-600">—</span>
                    </td>
                  );
                }
                const rate = rateMap.get(`${row}|${col}`);
                if (rate === undefined) {
                  return (
                    <td key={col} className="p-2 text-center bg-gray-800/20">
                      <span className="text-gray-600">?</span>
                    </td>
                  );
                }
                return (
                  <td key={col} className="p-1 text-center">
                    <div
                      className={`rounded px-2 py-1 font-mono font-bold ${getColor(rate)}`}
                    >
                      {rate}%
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
