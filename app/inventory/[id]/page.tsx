import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { fmt, fmtDate, categoryLabel, CONDITIONS, STATUS_LABELS, STATUS_COLORS } from "@/lib/utils";
import { ItemActions } from "./ItemActions";

type Props = { params: Promise<{ id: string }> };

export default async function ItemPage({ params }: Props) {
  const { id } = await params;
  const item = await prisma.item.findUnique({ where: { id }, include: { listing: true, sale: true } });
  if (!item) notFound();

  const conditionLabel = CONDITIONS.find((c) => c.value === item.condition)?.label ?? item.condition;
  const profit = item.sale ? item.sale.profit : null;
  const roi = item.sale ? (item.sale.profit / item.buyPrice) * 100 : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6 text-sm" style={{ color: "var(--text-muted)" }}>
        <Link href="/inventory" className="hover:underline">Inventory</Link>
        <span>›</span>
        <span style={{ color: "var(--text)" }}>{item.name}</span>
      </div>
      <div className="rounded-xl border p-6 mb-4" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold">{item.name}</h1>
            {item.brand && <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{item.brand}</p>}
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold shrink-0" style={{ background: STATUS_COLORS[item.status] + "22", color: STATUS_COLORS[item.status] }}>
            {STATUS_LABELS[item.status]}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Category", value: categoryLabel(item.category) },
            { label: "Condition", value: conditionLabel },
            { label: "Bought for", value: fmt(item.buyPrice) },
            { label: "Date bought", value: fmtDate(item.buyDate) },
          ].map((r) => (
            <div key={r.label}>
              <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{r.label}</p>
              <p className="font-medium text-sm">{r.value}</p>
            </div>
          ))}
        </div>
        {item.notes && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Notes</p>
            <p className="text-sm">{item.notes}</p>
          </div>
        )}
      </div>
      {item.listing && (
        <div className="rounded-xl border p-5 mb-4" style={{ background: "var(--surface)", borderColor: "#3b82f633" }}>
          <h2 className="font-semibold text-sm mb-3" style={{ color: "#3b82f6" }}>Listing</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-bold">{fmt(item.listing.listingPrice)}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                listed {fmtDate(item.listing.listingDate)}
                {item.listing.listingUrl && <> · <a href={item.listing.listingUrl} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--accent-light)" }}>View on Vinted</a></>}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>potential profit</p>
              <p className="font-bold" style={{ color: "#22c55e" }}>+{fmt(item.listing.listingPrice - item.buyPrice)}</p>
            </div>
          </div>
        </div>
      )}
      {item.sale && profit !== null && roi !== null && (
        <div className="rounded-xl border p-5 mb-4" style={{ background: "var(--surface)", borderColor: profit >= 0 ? "#22c55e33" : "#ef444433" }}>
          <h2 className="font-semibold text-sm mb-3" style={{ color: profit >= 0 ? "#22c55e" : "#ef4444" }}>Sale</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Sale price", value: fmt(item.sale.salePrice) },
              { label: "Fees + shipping", value: fmt(item.sale.platformFee + item.sale.shippingCost) },
              { label: "Profit", value: `${profit >= 0 ? "+" : ""}${fmt(profit)}`, color: profit >= 0 ? "#22c55e" : "#ef4444", bold: true },
            ].map((r) => (
              <div key={r.label}>
                <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{r.label}</p>
                <p className={r.bold ? "font-bold text-lg" : "font-medium text-sm"} style={r.color ? { color: r.color } : {}}>{r.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
            ROI: <span style={{ color: roi >= 0 ? "#22c55e" : "#ef4444" }}>{roi.toFixed(1)}%</span> · sold {fmtDate(item.sale.saleDate)}
          </p>
        </div>
      )}
      <ItemActions item={{ id: item.id, status: item.status, buyPrice: item.buyPrice, listing: item.listing, sale: item.sale }} />
    </div>
  );
}
