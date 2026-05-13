import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { fmt, fmtDate, categoryLabel, CATEGORIES, STATUS_LABELS, STATUS_COLORS } from "@/lib/utils";

type Props = { searchParams: Promise<{ status?: string; category?: string }> };

export default async function InventoryPage({ searchParams }: Props) {
  const { status, category } = await searchParams;

  const items = await prisma.item.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(category ? { category } : {}),
    },
    include: { listing: true, sale: true },
    orderBy: { createdAt: "desc" },
  });

  const statuses = ["", "BOUGHT", "LISTED", "SOLD"];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <Link
          href="/inventory/add"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: "var(--accent)" }}
        >
          + Add Item
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => {
          const label = s === "" ? "All" : STATUS_LABELS[s];
          const active = (status ?? "") === s;
          const params = new URLSearchParams();
          if (s) params.set("status", s);
          if (category) params.set("category", category);
          return (
            <Link
              key={s}
              href={`/inventory${params.toString() ? "?" + params.toString() : ""}`}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
              style={{
                background: active ? "var(--accent)" : "var(--surface)",
                borderColor: active ? "var(--accent)" : "var(--border)",
                color: active ? "#fff" : "var(--text-muted)",
              }}
            >
              {label}
            </Link>
          );
        })}
        <span className="mx-2 self-center text-xs" style={{ color: "var(--border)" }}>|</span>
        {CATEGORIES.map((c) => {
          const active = category === c.value;
          const params = new URLSearchParams();
          if (status) params.set("status", status);
          if (!active) params.set("category", c.value);
          return (
            <Link
              key={c.value}
              href={`/inventory${params.toString() ? "?" + params.toString() : ""}`}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
              style={{
                background: active ? "var(--surface-2)" : "var(--surface)",
                borderColor: active ? "var(--accent-light)" : "var(--border)",
                color: active ? "var(--accent-light)" : "var(--text-muted)",
              }}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      {items.length === 0 ? (
        <div
          className="rounded-xl border p-12 text-center"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <p className="text-3xl mb-3">🛍️</p>
          <p className="font-semibold">No items found</p>
          <p className="text-sm mt-1 mb-5" style={{ color: "var(--text-muted)" }}>
            Try a different filter or add a new item.
          </p>
          <Link
            href="/inventory/add"
            className="inline-block px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: "var(--accent)" }}
          >
            Add Item
          </Link>
        </div>
      ) : (
        <div
          className="rounded-xl border overflow-hidden"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {items.map((item) => {
              const profit = item.sale ? item.sale.profit : null;
              return (
                <Link
                  key={item.id}
                  href={`/inventory/${item.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm truncate">{item.name}</span>
                      {item.brand && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}>
                          {item.brand}
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {categoryLabel(item.category)} · bought {fmtDate(item.buyDate)} · {fmt(item.buyPrice)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {item.listing && (
                      <div className="text-right hidden sm:block">
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>listed</p>
                        <p className="text-sm font-medium">{fmt(item.listing.listingPrice)}</p>
                      </div>
                    )}
                    {profit !== null && (
                      <div className="text-right hidden sm:block">
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>profit</p>
                        <p className="text-sm font-semibold" style={{ color: profit >= 0 ? "#22c55e" : "#ef4444" }}>
                          {profit >= 0 ? "+" : ""}{fmt(profit)}
                        </p>
                      </div>
                    )}
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: STATUS_COLORS[item.status] + "22", color: STATUS_COLORS[item.status] }}
                    >
                      {STATUS_LABELS[item.status]}
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>›</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
