"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/utils";

export default function AddWatchlistPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSaving(true); setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/watchlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ keywords: fd.get("keywords"), category: fd.get("category"), maxPrice: fd.get("maxPrice"), notes: fd.get("notes") }) });
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed"); setSaving(false); return; }
    router.push("/watchlist");
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Add Deal to Watchlist</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Define what you&apos;re looking to snipe — keyword, category, and the max you&apos;d pay.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border p-6 space-y-4" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Search keywords *</label>
            <input name="keywords" required placeholder='e.g. "hugo boss polo xl"' className="w-full px-3 py-2 rounded-lg text-sm border outline-none" style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text)" }} />
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Use the exact terms you&apos;d type into Vinted search</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Category *</label>
              <select name="category" required className="w-full px-3 py-2 rounded-lg text-sm border outline-none" style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text)" }}>
                <option value="">Select…</option>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Max buy price (€) *</label>
              <input name="maxPrice" type="number" step="0.01" min="0" required placeholder="0.00" className="w-full px-3 py-2 rounded-lg text-sm border outline-none" style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Notes (optional)</label>
            <input name="notes" placeholder="e.g. resells for €40–60, size M only" className="w-full px-3 py-2 rounded-lg text-sm border outline-none" style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text)" }} />
          </div>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>Cancel</button>
          <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60" style={{ background: "var(--accent)" }}>{saving ? "Saving…" : "Add to Watchlist"}</button>
        </div>
      </form>
    </div>
  );
}
