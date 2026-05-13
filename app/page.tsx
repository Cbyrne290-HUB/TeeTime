import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { fmt, fmtDate, categoryLabel } from "@/lib/utils";

async function getStats() {
  const [items, recentSales] = await Promise.all([
    prisma.item.findMany({ include: { sale: true } }),
    prisma.sale.findMany({ orderBy: { saleDate: "desc" }, take: 8, include: { item: true } }),
  ]);
  const totalSpent = items.reduce((s, i) => s + i.buyPrice, 0);
  const totalRevenue = items.filter((i) => i.sale).reduce((s, i) => s + (i.sale?.salePrice ?? 0), 0);
  const totalProfit = items.filter((i) => i.sale).reduce((s, i) => s + (i.sale?.profit ?? 0), 0);
  const roi = totalSpent > 0 ? (totalProfit / totalSpent) * 100 : 0;
  return {
    totalItems: items.length,
    bought: items.filter((i) => i.status === "BOUGHT").length,
    listed: items.filter((i) => i.status === "LISTED").length,
    soldCount: items.filter((i) => i.status === "SOLD").length,
    totalSpent, totalRevenue, totalProfit, roi, recentSales,
  };
}

export default async function DashboardPage() {
  const s = await getStats();
  const statCards = [
    { label: "Total Profit", value: fmt(s.totalProfit), sub: `${s.soldCount} items sold`, color: s.totalProfit >= 0 ? "#22c55e" : "#ef4444" },
    { label: "ROI", value: `${s.roi.toFixed(1)}%`, sub: `spent ${fmt(s.totalSpent)}`, color: "#9b7fdc" },
    { label: "In Stock", value: String(s.bought), sub: "items to list", color: "#f59e0b" },
    { label: "Listed", value: String(s.listed), sub: "awaiting sale", color: "#3b82f6" },
  ];
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Your reselling overview</p>
        </div>
        <Link href="/inventory/add" className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "var(--accent)" }}>
          + Add Item
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((c) => (
          <div key={c.label} className="rounded-xl p-5 border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>{c.label}</p>
            <p className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{c.sub}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-4 mb-10">
        <div className="rounded-xl p-5 border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <h2 className="font-semibold mb-4">Money Summary</h2>
          <div className="space-y-3">
            {[
              { label: "Total spent buying", value: fmt(s.totalSpent), color: "#ef4444" },
              { label: "Total revenue sold", value: fmt(s.totalRevenue), color: "#22c55e" },
              { label: "Net profit", value: fmt(s.totalProfit), color: s.totalProfit >= 0 ? "#22c55e" : "#ef4444", bold: true },
            ].map((r) => (
              <div key={r.label} className="flex justify-between items-center">
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>{r.label}</span>
                <span className={r.bold ? "font-bold text-base" : "font-medium text-sm"} style={{ color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 rounded-xl p-5 border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <h2 className="font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: "/inventory/add", label: "Add New Item", desc: "Log something you've bought", icon: "📦" },
              { href: "/inventory?status=BOUGHT", label: "Items to List", desc: "Items still in stock", icon: "🏷️" },
              { href: "/inventory?status=LISTED", label: "Awaiting Sale", desc: "Currently listed items", icon: "⏳" },
              { href: "/watchlist/add", label: "Add to Watchlist", desc: "Track a deal to snipe", icon: "👀" },
            ].map((a) => (
              <Link key={a.href} href={a.href} className="flex items-start gap-3 p-4 rounded-lg border transition-colors hover:border-purple-500" style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
                <span className="text-2xl">{a.icon}</span>
                <div>
                  <p className="font-medium text-sm">{a.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{a.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {s.recentSales.length > 0 && (
        <div className="rounded-xl border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
            <h2 className="font-semibold">Recent Sales</h2>
            <Link href="/inventory?status=SOLD" className="text-xs" style={{ color: "var(--accent-light)" }}>View all</Link>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {s.recentSales.map((sale) => (
              <div key={sale.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{sale.item.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{categoryLabel(sale.item.category)} · {fmtDate(sale.saleDate)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm" style={{ color: sale.profit >= 0 ? "#22c55e" : "#ef4444" }}>{sale.profit >= 0 ? "+" : ""}{fmt(sale.profit)}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>sold {fmt(sale.salePrice)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {s.totalItems === 0 && (
        <div className="rounded-xl border p-12 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <p className="text-4xl mb-4">📦</p>
          <h2 className="font-semibold text-lg mb-2">No items yet</h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Start by adding the first item you&apos;ve bought to flip.</p>
          <Link href="/inventory/add" className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: "var(--accent)" }}>
            Add Your First Item
          </Link>
        </div>
      )}
    </div>
  );
}
