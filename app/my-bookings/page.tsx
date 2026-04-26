"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Flag, Clock, Users, MapPin, CheckCircle, XCircle, Calendar } from "lucide-react";

type Booking = {
  id: string; confirmationCode: string; guestName: string; numberOfPlayers: number;
  needsTrolley: boolean; needsBuggy: boolean; totalPrice: number; status: string;
  createdAt: string;
  teeTime: { dateTime: string; club: { name: string; county: string; slug: string } };
};

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((d) => { setBookings(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [status]);

  if (status === "loading" || loading)
    return <div className="p-8 text-center text-gray-500">Loading your bookings…</div>;

  const upcoming = bookings.filter((b) => new Date(b.teeTime.dateTime) >= new Date() && b.status !== "cancelled");
  const past = bookings.filter((b) => new Date(b.teeTime.dateTime) < new Date() || b.status === "cancelled");

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Bookings</h1>
      <p className="text-gray-500 text-sm mb-8">Signed in as {session?.user?.name}</p>

      {bookings.length === 0 && (
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
          <Flag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No bookings yet</p>
          <Link href="/search" className="mt-4 inline-block bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
            Find a tee time
          </Link>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Upcoming</h2>
          <div className="space-y-3">
            {upcoming.map((b) => <BookingCard key={b.id} booking={b} />)}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Past & Cancelled</h2>
          <div className="space-y-3 opacity-75">
            {past.map((b) => <BookingCard key={b.id} booking={b} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const isCancelled = booking.status === "cancelled";
  const time = new Date(booking.teeTime.dateTime).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" });
  const dateStr = new Date(booking.teeTime.dateTime).toLocaleDateString("en-IE", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  return (
    <Link href={`/confirmation/${booking.confirmationCode}`}
      className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isCancelled
              ? <XCircle className="w-4 h-4 text-red-500" />
              : <CheckCircle className="w-4 h-4 text-green-600" />}
            <span className="font-bold text-gray-900">{booking.teeTime.club.name}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="w-3.5 h-3.5" /> {booking.teeTime.club.county}
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-lg text-green-800">{time}</div>
          <div className="text-xs text-gray-400">{isCancelled ? "Cancelled" : "Confirmed"}</div>
        </div>
      </div>
      <div className="flex gap-4 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{dateStr}</span>
        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{booking.numberOfPlayers} players</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />€{booking.totalPrice.toFixed(2)}</span>
      </div>
      <div className="mt-2 text-xs font-mono text-gray-400">{booking.confirmationCode}</div>
    </Link>
  );
}
