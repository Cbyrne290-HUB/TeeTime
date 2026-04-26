"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Flag, Clock, Users, Phone, Mail, MapPin, Calendar } from "lucide-react";

type Booking = {
  id: string; confirmationCode: string; guestName: string; guestEmail: string;
  guestPhone: string; numberOfPlayers: number; needsTrolley: boolean; needsBuggy: boolean;
  totalPrice: number; status: string; notes: string | null;
  teeTime: { dateTime: string; pricePerPlayer: number; club: { name: string; address: string; county: string; phone: string | null; holes: number } };
};

export function ConfirmationView() {
  const { code } = useParams<{ code: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/bookings/${code}`)
      .then((r) => r.json())
      .then((d) => { setBooking(d.error ? null : d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [code]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading your booking…</div>;
  if (!booking) return <div className="p-8 text-center text-gray-500">Booking not found.</div>;

  const time = new Date(booking.teeTime.dateTime).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" });
  const dateStr = new Date(booking.teeTime.dateTime).toLocaleDateString("en-IE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const isCancelled = booking.status === "cancelled";

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      {/* Status banner */}
      <div className={`rounded-2xl p-6 text-white text-center mb-6 shadow-lg ${isCancelled ? "bg-red-600" : "bg-green-700"}`}>
        <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-90" />
        <h1 className="text-2xl font-bold mb-1">{isCancelled ? "Booking Cancelled" : "You're all set!"}</h1>
        <p className="text-sm opacity-80">{isCancelled ? "This booking has been cancelled." : "Your tee time is confirmed. See you on the course!"}</p>
        <div className="mt-3 bg-white/20 rounded-full px-4 py-1 inline-block text-sm font-mono font-bold tracking-widest">
          {booking.confirmationCode}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Club & time */}
        <div className="bg-green-50 p-5 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flag className="w-5 h-5 text-green-700" />
                <span className="font-bold text-gray-900">{booking.teeTime.club.name}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="w-3.5 h-3.5" />
                {booking.teeTime.club.address}, {booking.teeTime.club.county}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-800">{time}</div>
              <div className="text-xs text-gray-500">{booking.teeTime.club.holes} holes</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600 mt-3">
            <Calendar className="w-4 h-4" /> {dateStr}
          </div>
        </div>

        {/* Details */}
        <div className="p-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 flex items-center gap-1"><Users className="w-4 h-4" />Players</span>
            <span className="font-medium">{booking.numberOfPlayers}</span>
          </div>
          {(booking.needsTrolley || booking.needsBuggy) && (
            <div className="flex justify-between">
              <span className="text-gray-500">Equipment</span>
              <span className="font-medium">{[booking.needsTrolley && "Trolley", booking.needsBuggy && "Buggy"].filter(Boolean).join(", ")}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500 flex items-center gap-1"><Mail className="w-4 h-4" />Email</span>
            <span className="font-medium">{booking.guestEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 flex items-center gap-1"><Phone className="w-4 h-4" />Phone</span>
            <span className="font-medium">{booking.guestPhone}</span>
          </div>
          {booking.notes && (
            <div className="flex justify-between">
              <span className="text-gray-500">Notes</span>
              <span className="font-medium text-right max-w-[60%]">{booking.notes}</span>
            </div>
          )}
          <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base">
            <span>Total (pay at club)</span>
            <span className="text-green-700">€{booking.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Club phone */}
        {booking.teeTime.club.phone && (
          <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 text-sm text-gray-500 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Club: <a href={`tel:${booking.teeTime.club.phone}`} className="text-green-700 font-medium hover:underline">{booking.teeTime.club.phone}</a>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/" className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm text-center font-medium hover:bg-gray-50 transition-colors">
          Back to home
        </Link>
        <Link href="/search" className="flex-1 bg-green-700 text-white py-2.5 rounded-xl text-sm text-center font-medium hover:bg-green-600 transition-colors">
          Book another
        </Link>
      </div>
    </div>
  );
}
