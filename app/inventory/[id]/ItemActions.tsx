"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fmt } from "@/lib/utils";

type Item = {
  id: string;
  status: string;
  buyPrice: number;
  listing: { listingPrice: number; listingUrl?: string | null } | null;
  sale: { salePrice: number; platformFee: number; shippingCost: number; profit: number } | null;
};

export function ItemActions({ item }: { item: Item }) {
  const router = useRouter();
  const [modal, setModal] = useState<"list" | "sell" | "delete" | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function markListed(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/items/${item.id}/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingPrice: fd.get("listingPrice"), listingUrl: fd.get("listingUrl") }),
    });
    if (!res.ok) { setErr("Failed"); setBusy(false); return; }
    setModal(null);
    router.refresh();
  }

  async function markSold(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/items/${item.id}/sell`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        salePrice: fd.get("salePrice"),
        platformFee: fd.get("platformFee") || 0,
        shippingCost: fd.get("shippingCost") || 0,
      }),
    });
    if (!res.ok) { setErr("Failed"); setBusy(false); return; }
    setModal(null);
    router.refresh();
  }

  async function deleteItem() {
    setBusy(true);
    await fetch(`/api/items/${item.id}`, { method: "DELETE" });
    router.push("/inventory");
  }

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {item.status !== "SOLD" && item.status !== "ARCHIVED" && (
          <button
            onClick={() => setModal("list")}
            className="px-4 py-2 rounded-lg text-sm font-semibold border transition-colors hover:bg-blue-500/10"
            style={{ borderColor: "#3b82f6", color: "#3b82f6" }}
          >
            {item.listing ? "Update Listing" : "Mark as Listed"}
          </button>
        )}
        {item.status === "LISTED" && (
          <button
            onClick={() => setModal("sell")}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: "#22c55e" }}
          >
            Mark as Sold ✓
          </button>
        )}
        {item.status === "BOUGHT" && (
          <button
            onClick={() => setModal("sell")}
            className="px-4 py-2 rounded-lg text-sm font-semibold border transition-colors hover:bg-green-500/10"
            style={{ borderColor: "#22c55e", color: "#22c55e" }}
          >
            Mark as Sold
          </button>
        )}
        <button
          onClick={() => setModal("delete")}
          className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-red-500/10 ml-auto"
          style={{ borderColor: "var(--border)", color: "#ef4444" }}
        >
          Delete
        </button>
      </div>

      {/* List modal */}
      {modal === "list" && (
        <Modal title={item.listing ? "Update Listing" : "Mark as Listed"} onClose={() => setModal(null)}>
          <form onSubmit={markListed} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                Listing price (€) *
              </label>
              <input
                name="listingPrice"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={item.listing?.listingPrice ?? ""}
                placeholder="0.00"
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:border-purple-500"
                style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text)" }}
              />
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Bought for {fmt(item.buyPrice)} — aim for at least {fmt(item.buyPrice * 1.5)}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                Vinted listing URL (optional)
              </label>
              <input
                name="listingUrl"
                type="url"
                defaultValue={item.listing?.listingUrl ?? ""}
                placeholder="https://www.vinted.co.uk/items/…"
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:border-purple-500"
                style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
            {err && <p className="text-sm text-red-400">{err}</p>}
            <ModalButtons busy={busy} onCancel={() => setModal(null)} label="Save" />
          </form>
        </Modal>
      )}

      {/* Sell modal */}
      {modal === "sell" && (
        <Modal title="Mark as Sold" onClose={() => setModal(null)}>
          <form onSubmit={markSold} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                Sale price (€) *
              </label>
              <input
                name="salePrice"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={item.listing?.listingPrice ?? ""}
                placeholder="0.00"
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:border-purple-500"
                style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Platform fee (€)
                </label>
                <input
                  name="platformFee"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue="0"
                  className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:border-purple-500"
                  style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Shipping cost (€)
                </label>
                <input
                  name="shippingCost"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue="0"
                  className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:border-purple-500"
                  style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Vinted usually charges 0 seller fees — buyers pay the protection fee. Leave at 0 unless you paid for promoted listing.
            </p>
            {err && <p className="text-sm text-red-400">{err}</p>}
            <ModalButtons busy={busy} onCancel={() => setModal(null)} label="Confirm Sale" />
          </form>
        </Modal>
      )}

      {/* Delete confirm */}
      {modal === "delete" && (
        <Modal title="Delete Item?" onClose={() => setModal(null)}>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            This will permanently delete the item and all its records. This cannot be undone.
          </p>
          <ModalButtons busy={busy} onCancel={() => setModal(null)} label="Delete" danger onClick={deleteItem} />
        </Modal>
      )}
    </>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div
        className="w-full max-w-md rounded-2xl p-6 border"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg">{title}</h2>
          <button onClick={onClose} className="text-xl" style={{ color: "var(--text-muted)" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalButtons({
  busy,
  onCancel,
  label,
  danger = false,
  onClick,
}: {
  busy: boolean;
  onCancel: () => void;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        Cancel
      </button>
      <button
        type={onClick ? "button" : "submit"}
        onClick={onClick}
        disabled={busy}
        className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
        style={{ background: danger ? "#ef4444" : "var(--accent)" }}
      >
        {busy ? "…" : label}
      </button>
    </div>
  );
}
