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
import { toDailyRows } from "@/lib/weather";

export default function TemperatureChart({ fileData }) {
  const rows = toDailyRows(fileData);

  if (rows.length === 0) {
    return <p className="text-sm text-slate-400">Select a file to see its temperature trend.</p>;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} unit="°C" />
          <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0", fontSize: 13 }} />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Line type="monotone" dataKey="tempMax" name="Max Temp" stroke="#ea580c" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="tempMin" name="Min Temp" stroke="#0284c7" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}