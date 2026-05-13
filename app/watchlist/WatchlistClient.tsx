"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fmt, fmtDate, categoryLabel } from "@/lib/utils";

type WatchlistItem = {
  id: string;
  keywords: string;
  category: string;
  maxPrice: number;
  notes: string | null;
  isActive: boolean;
  createdAt: string | Date;
};

export function WatchlistClient({ items }: { items: WatchlistItem[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function toggle(id: string, isActive: boolean) {
    setBusy(id);
    await fetch(`/api/watchlist/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    setBusy(null);
    router.refresh();
  }

  async function remove(id: string) {
    setBusy(id);
    await fetch(`/api/watchlist/${id}`, { method: "DELETE" });
    setBusy(null);
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <div
        className="rounded-xl border p-12 text-center"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <p className="text-3xl mb-3">👀</p>
        <p className="font-semibold">Nothing on your watchlist</p>
        <p className="text-sm mt-1 mb-5" style={{ color: "var(--text-muted)" }}>
          Add deals you want to snipe — keywords, category, max price.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border p-4 flex items-start gap-4"
          style={{
            background: "var(--surface)",
            borderColor: item.isActive ? "var(--border)" : "var(--border)",
            opacity: item.isActive ? 1 : 0.5,
          }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{item.keywords}</span>
              <span
                className="px-2 py-0.5 rounded-full text-xs"
                style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
              >
                {categoryLabel(item.category)}
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Max price: <span className="font-semibold" style={{ color: "var(--accent-light)" }}>{fmt(item.maxPrice)}</span>
              {item.notes && <> · {item.notes}</>}
              {" · "}added {fmtDate(item.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggle(item.id, item.isActive)}
              disabled={busy === item.id}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
              style={{
                borderColor: item.isActive ? "#22c55e" : "var(--border)",
                color: item.isActive ? "#22c55e" : "var(--text-muted)",
              }}
            >
              {item.isActive ? "Active" : "Paused"}
            </button>
            <button
              onClick={() => remove(item.id)}
              disabled={busy === item.id}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-red-500/10"
              style={{ borderColor: "var(--border)", color: "#ef4444" }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
