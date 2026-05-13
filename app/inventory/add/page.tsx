"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, CONDITIONS } from "@/lib/utils";

export default function AddItemPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name"),
      brand: fd.get("brand"),
      category: fd.get("category"),
      condition: fd.get("condition"),
      buyPrice: fd.get("buyPrice"),
      buyDate: fd.get("buyDate"),
      notes: fd.get("notes"),
    };

    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save");
      setSaving(false);
      return;
    }

    const item = await res.json();
    router.push(`/inventory/${item.id}`);
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add Item</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          className="rounded-xl border p-6 space-y-4"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                Item name *
              </label>
              <input
                name="name"
                required
                placeholder="e.g. Hugo Boss polo shirt"
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:border-purple-500"
                style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                Brand
              </label>
              <input
                name="brand"
                placeholder="e.g. Hugo Boss"
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:border-purple-500"
                style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                Buy price (€) *
              </label>
              <input
                name="buyPrice"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:border-purple-500"
                style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                Category *
              </label>
              <select
                name="category"
                required
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:border-purple-500"
                style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text)" }}
              >
                <option value="">Select…</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                Condition *
              </label>
              <select
                name="condition"
                required
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:border-purple-500"
                style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text)" }}
              >
                <option value="">Select…</option>
                {CONDITIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                Date bought
              </label>
              <input
                name="buyDate"
                type="date"
                defaultValue={today}
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:border-purple-500"
                style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                Notes
              </label>
              <textarea
                name="notes"
                rows={3}
                placeholder="Any details about the item…"
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:border-purple-500 resize-none"
                style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: "var(--accent)" }}
          >
            {saving ? "Saving…" : "Save Item"}
          </button>
        </div>
      </form>
    </div>
  );
}
