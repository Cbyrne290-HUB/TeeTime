"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Globe, Flag, Clock, Users, Calendar, ChevronLeft } from "lucide-react";

type TeeTime = { id: string; dateTime: string; pricePerPlayer: number; maxPlayers: number; bookedCount: number };
type Club = {
  id: string; name: string; slug: string; description: string | null;
  address: string; county: string; lat: number; lng: number;
  phone: string | null; email: string | null; website: string | null;
  holes: number; par: number; imageUrl: string | null;
  teeTimes: TeeTime[];
};

export function ClubProfile() {
  const { slug } = useParams<{ slug: string }>();
  const sp = useSearchParams();
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(sp.get("date") ?? today);
  const players = parseInt(sp.get("players") ?? "1");
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/clubs/${slug}?date=${date}`)
      .then((r) => r.json())
      .then((d) => { setClub(d.error ? null : d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug, date]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading…</div>;
  if (!club) return <div className="p-8 text-center text-gray-500">Club not found.</div>;

  const available = club.teeTimes.filter((tt) => tt.maxPlayers - tt.bookedCount >= players);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/search" className="flex items-center gap-1 text-sm text-green-700 hover:text-green-600 mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to search
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="bg-green-800 h-40 flex items-center justify-center relative">
          {club.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={club.imageUrl} alt={club.name} className="w-full h-full object-cover absolute inset-0" />
          ) : (
            <Flag className="w-16 h-16 text-green-400 opacity-50" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 to-transparent" />
          <div className="absolute bottom-4 left-6 text-white">
            <h1 className="text-2xl font-bold">{club.name}</h1>
            <div className="flex items-center gap-1 text-green-200 text-sm">
              <MapPin className="w-3.5 h-3.5" /> {club.address}, {club.county}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1"><Flag className="w-4 h-4 text-green-600" />{club.holes} holes · Par {club.par}</span>
            {club.phone && <a href={`tel:${club.phone}`} className="flex items-center gap-1 hover:text-green-700"><Phone className="w-4 h-4" />{club.phone}</a>}
            {club.website && <a href={club.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-green-700"><Globe className="w-4 h-4" />Website</a>}
          </div>
          {club.description && <p className="text-gray-600 text-sm leading-relaxed">{club.description}</p>}
        </div>
      </div>

      {/* Date picker + tee times */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-lg font-bold text-gray-800">Available Tee Times</h2>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {available.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No available tee times on this date</p>
            <p className="text-sm mt-1">Try a different date</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {available.map((tt) => {
              const spotsLeft = tt.maxPlayers - tt.bookedCount;
              const time = new Date(tt.dateTime).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" });
              return (
                <Link
                  key={tt.id}
                  href={`/book/${tt.id}?date=${date}&players=${players}&clubSlug=${club.slug}`}
                  className="flex flex-col items-center bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl p-4 transition-colors group"
                >
                  <span className="text-lg font-bold text-green-900 group-hover:text-green-700">{time}</span>
                  <span className="text-sm text-green-700 font-semibold mt-1">€{tt.pricePerPlayer}<span className="text-xs font-normal text-green-500">/player</span></span>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1.5">
                    <Users className="w-3 h-3" />
                    <span>{spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
