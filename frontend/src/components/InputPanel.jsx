"use client";

import { useState } from "react";
import { storeWeatherData } from "@/lib/api";

const initialForm = {
  latitude: "",
  longitude: "",
  start_date: "",
  end_date: "",
};

export default function InputPanel({ onStored }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const result = await storeWeatherData({
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        start_date: form.start_date,
        end_date: form.end_date,
      });
      setStatus("success");
      setMessage(result.file);
      onStored?.(result.file);
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-sm text-slate-600">
          Latitude
          <input
            type="number" name="latitude" value={form.latitude} onChange={handleChange}
            step="any" min="-90" max="90" required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </label>
        <label className="text-sm text-slate-600">
          Longitude
          <input
            type="number" name="longitude" value={form.longitude} onChange={handleChange}
            step="any" min="-180" max="180" required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-sm text-slate-600">
          Start Date
          <input
            type="date" name="start_date" value={form.start_date} onChange={handleChange} required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </label>
        <label className="text-sm text-slate-600">
          End Date
          <input
            type="date" name="end_date" value={form.end_date} onChange={handleChange} required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {status === "loading" ? "Fetching..." : "Fetch & Store Data"}
      </button>

      {status === "success" && (
        <p className="text-sm text-green-600 break-all">Saved as: {message}</p>
      )}
      {status === "error" && <p className="text-sm text-red-600">{message}</p>}
    </form>
  );
}