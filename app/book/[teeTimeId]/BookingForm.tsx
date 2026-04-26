"use client";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Flag, Clock, Users, CreditCard, Phone, Mail, User, ChevronLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

type TeeTime = { id: string; dateTime: string; pricePerPlayer: number; maxPlayers: number; bookedCount: number; club: { name: string; slug: string; address: string; county: string; holes: number } };

export function BookingForm() {
  const { teeTimeId } = useParams<{ teeTimeId: string }>();
  const sp = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const sessionUser = session?.user as { name?: string; email?: string } | undefined;

  const playersFromSearch = parseInt(sp.get("players") ?? "1");
  const clubSlug = sp.get("clubSlug") ?? "";

  const [teeTime, setTeeTime] = useState<TeeTime | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(sessionUser?.name ?? "");
  const [email, setEmail] = useState(sessionUser?.email ?? "");
  const [phone, setPhone] = useState("");
  const [players, setPlayers] = useState(playersFromSearch);
  const [trolley, setTrolley] = useState(false);
  const [buggy, setBuggy] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetch(`/api/tee-times/${teeTimeId}`)
      .then((r) => r.json())
      .then((d) => { setTeeTime(d.error ? null : d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [teeTimeId]);

  useEffect(() => {
    if (session?.user) {
      setName(sessionUser?.name ?? "");
      setEmail(sessionUser?.email ?? "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teeTimeId, guestName: name, guestEmail: email, guestPhone: phone, numberOfPlayers: players, needsTrolley: trolley, needsBuggy: buggy, notes }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Booking failed. Please try again.");
      setSubmitting(false);
      return;
    }

    router.push(`/confirmation/${data.confirmationCode}`);
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading…</div>;
  if (!teeTime) return <div className="p-8 text-center text-gray-500">Tee time not found or no longer available.</div>;

  const time = new Date(teeTime.dateTime).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" });
  const dateStr = new Date(teeTime.dateTime).toLocaleDateString("en-IE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const spotsLeft = teeTime.maxPlayers - teeTime.bookedCount;
  const total = teeTime.pricePerPlayer * players;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link href={clubSlug ? `/clubs/${clubSlug}` : "/search"} className="flex items-center gap-1 text-sm text-green-700 hover:text-green-600 mb-6">
        <ChevronLeft className="w-4 h-4" /> Back
      </Link>

      {/* Tee time summary */}
      <div className="bg-green-800 text-white rounded-2xl p-5 mb-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flag className="w-5 h-5 text-green-300" />
              <span className="font-bold text-lg">{teeTime.club.name}</span>
            </div>
            <p className="text-green-200 text-sm">{teeTime.club.address}, {teeTime.club.county}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{time}</div>
            <div className="text-green-300 text-xs">{teeTime.club.holes} holes</div>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 text-sm text-green-100 flex-wrap">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{dateStr}</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{spotsLeft} spots remaining</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <h2 className="font-bold text-gray-800 text-lg">Your Details</h2>

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Full Name *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="John Murphy" />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="john@example.com" />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input required value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="+353 87 123 4567" type="tel" />
          </div>
        </div>

        {/* Players */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Number of Players *</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select value={players} onChange={(e) => setPlayers(parseInt(e.target.value))}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none">
              {[...Array(Math.min(spotsLeft, 4))].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? "player" : "players"}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Equipment */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Equipment Needed</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={trolley} onChange={(e) => setTrolley(e.target.checked)}
                className="w-4 h-4 accent-green-700 rounded" />
              <span className="text-sm text-gray-700">Trolley</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={buggy} onChange={(e) => setBuggy(e.target.checked)}
                className="w-4 h-4 accent-green-700 rounded" />
              <span className="text-sm text-gray-700">Buggy / Golf Cart</span>
            </label>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            placeholder="Anything the club should know…" />
        </div>

        {/* Price summary */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>€{teeTime.pricePerPlayer} × {players} player{players !== 1 ? "s" : ""}</span>
            <span>€{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-200 pt-2">
            <span>Total (pay at club)</span>
            <span>€{total.toFixed(2)}</span>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={submitting}
          className="w-full bg-green-700 hover:bg-green-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-base">
          <CheckCircle className="w-5 h-5" />
          {submitting ? "Confirming…" : "Confirm Booking"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Payment is made directly at the club. A confirmation will be sent to your email.
        </p>
      </form>
    </div>
  );
}
