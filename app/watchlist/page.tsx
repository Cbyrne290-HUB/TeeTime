import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { WatchlistClient } from "./WatchlistClient";

export default async function WatchlistPage() {
  const items = await prisma.watchlistItem.findMany({ orderBy: [{ isActive: "desc" }, { createdAt: "desc" }] });
  const active = items.filter((i) => i.isActive).length;
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Watchlist</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{active} active deal{active !== 1 ? "s" : ""} to snipe</p>
        </div>
        <Link href="/watchlist/add" className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "var(--accent)" }}>+ Add Deal</Link>
      </div>
      <div className="rounded-xl border p-4 mb-6 text-sm" style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-muted)" }}>
        <strong style={{ color: "var(--text)" }}>How to snipe:</strong> Add keywords you search on Vinted, set your max buy price. Search Vinted manually for that term — when you find something under your max, buy it and log it in Inventory.
      </div>
      <WatchlistClient items={items.map((i) => ({ ...i, createdAt: i.createdAt.toISOString() }))} />
    </div>
  );
}
