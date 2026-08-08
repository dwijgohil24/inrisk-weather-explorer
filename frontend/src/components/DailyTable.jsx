"use client";

import { useState, useEffect } from "react";
import { toDailyRows } from "@/lib/weather";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function DailyTable({ fileData }) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const rows = toDailyRows(fileData);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

  useEffect(() => {
    setPage(0);
  }, [fileData]);

  if (rows.length === 0) {
    return <p className="text-sm text-slate-400">Select a file to see its daily data.</p>;
  }

  const start = page * pageSize;
  const visibleRows = rows.slice(start, start + pageSize);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 pr-4 font-medium">Max Temp (°C)</th>
              <th className="py-2 pr-4 font-medium">Min Temp (°C)</th>
              <th className="py-2 pr-4 font-medium">Feels Like Max</th>
              <th className="py-2 pr-4 font-medium">Feels Like Min</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.date} className="border-b border-slate-100 last:border-0">
                <td className="py-2 pr-4 text-slate-700">{row.date}</td>
                <td className="py-2 pr-4 text-warm-600">{row.tempMax}</td>
                <td className="py-2 pr-4 text-brand-600">{row.tempMin}</td>
                <td className="py-2 pr-4 text-slate-500">{row.apparentMax}</td>
                <td className="py-2 pr-4 text-slate-500">{row.apparentMin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          Rows per page:
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
            className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 rounded-lg border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Prev
          </button>
          <span className="text-slate-500">Page {page + 1} of {totalPages}</span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 rounded-lg border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}