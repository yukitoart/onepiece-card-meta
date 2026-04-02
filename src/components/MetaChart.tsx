"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { MetaWeekly } from "@/lib/types";
import { DECK_COLORS } from "@/lib/types";

export default function MetaChart({ data }: { data: MetaWeekly[] }) {
  // recharts用にフラット変換
  const allDecks = new Set<string>();
  data.forEach((w) => w.data.forEach((d) => allDecks.add(d.deckName)));
  const deckList = Array.from(allDecks);

  const chartData = data.map((w) => {
    const row: Record<string, string | number> = { week: w.week };
    for (const d of w.data) {
      row[d.deckName] = d.usageRate;
    }
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="week"
          stroke="#9ca3af"
          tick={{ fill: "#9ca3af", fontSize: 12 }}
        />
        <YAxis
          stroke="#9ca3af"
          tick={{ fill: "#9ca3af", fontSize: 12 }}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#fff",
          }}
          formatter={(value) => [`${value}%`, ""]}
        />
        <Legend
          wrapperStyle={{ color: "#9ca3af", fontSize: 12 }}
        />
        {deckList.map((deckName) => (
          <Line
            key={deckName}
            type="monotone"
            dataKey={deckName}
            stroke={DECK_COLORS[deckName] || "#6b7280"}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
