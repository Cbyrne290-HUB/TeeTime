"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Phone, Globe, Flag, Clock, Users, Calendar, ChevronLeft, Star, Wind } from "lucide-react";

type TeeTime = { id: string; dateTime: string; pricePerPlayer: number; maxPlayers: number; bookedCount: number };
type Club = {
  id: string; name: string; slug: string; description: string | null;
  address: string; county: string; lat: number; lng: number;
  phone: string | null; email: string | null; website: string | null;
  holes: number; par: number; imageUrl: string | null;
  teeTimes: TeeTime[];
};

const GRADIENTS: Record<string, string> = {
  Dublin: "from-blue-700 via-indigo-800 to-slate-900",
  Kildare: "from-emerald-700 via-teal-800 to-slate-900",
  Kerry: "from-amber-700 via-orange-800 to-slate-900",
  Cork: "from-red-700 via-rose-800 to-slate-900",
  Clare: "from-violet-700 via-purple-800 to-slate-900",
  Wicklow: "from-green-700 via-emerald-800 to-slate-900",
  Kilkenny: "from-slate-600 via-gray-800 to-slate-900",
  Limerick: "from-cyan-700 via-sky-800 to-slate-900",
  Sligo: "from-teal-700 via-cyan-800 to-slate-900",
  Galway: "from-orange-700 via-amber-800 to-slate-900",
  Derry: "from-pink-700 via-rose-800 to-slate-900",
  Antrim: "from-indigo-700 via-violet-800 to-slate-900",
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

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      <div className="skeleton h-64 rounded-3xl" />
      <div className="skeleton h-48 rounded-2xl" />
    </div>
  );
  if (!club) return <div className="p-8 text-center text-slate-500">Club not found.</div>;

  const available = club.teeTimes.filter((tt) => tt.maxPlayers - tt.bookedCount >= players);
  const gradient = GRADIENTS[club.county] ?? "from-slate-700 via-gray-800 to-slate-900";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/search" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to search
        </Link>

        {/* Club hero card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${gradient} rounded-3xl p-8 mb-6 relative overflow-hidden`}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="relative">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                    <Flag className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/60 text-sm font-medium">{club.county}, Ireland</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{club.name}</h1>
                <div className="flex items-center gap-1.5 text-white/70 text-sm">
                  <MapPin className="w-4 h-4" /> {club.address}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-white font-bold">4.8</span>
                </div>
                <div className="text-white/60 text-sm">{club.holes} holes · Par {club.par}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              {club.phone && (
                <a href={`tel:${club.phone}`}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl px-3 py-1.5 text-white text-sm transition-colors">
                  <Phone className="w-3.5 h-3.5" /> {club.phone}
                </a>
              )}
              {club.website && (
                <a href={club.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl px-3 py-1.5 text-white text-sm transition-colors">
                  <Globe className="w-3.5 h-3.5" /> Website
                </a>
              )}
              <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 text-white text-sm">
                <Wind className="w-3.5 h-3.5" /> Links course
              </div>
            </div>

            {club.description && (
              <p className="text-white/60 text-sm mt-4 leading-relaxed max-w-2xl">{club.description}</p>
            )}
          </div>
        </motion.div>

        {/* Tee times */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Available Tee Times</h2>
              <p className="text-slate-400 text-sm mt-0.5">{available.length} slots available</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input type="date" value={date} min={today}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent text-sm text-slate-700 focus:outline-none" />
            </div>
          </div>

          {available.length === 0 ? (
            <div className="text-center py-16">
              <Clock className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 font-semibold">No tee times on this date</p>
              <p className="text-slate-400 text-sm mt-1">Try selecting a different date above</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
              {available.map((tt, i) => {
                const spotsLeft = tt.maxPlayers - tt.bookedCount;
                const time = new Date(tt.dateTime).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" });
                const urgent = spotsLeft <= 1;
                return (
                  <motion.div key={tt.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}>
                    <Link href={`/book/${tt.id}?date=${date}&players=${players}&clubSlug=${club.slug}`}
                      className={`flex flex-col items-center rounded-2xl p-3 transition-all duration-200 group border-2 ${
                        urgent
                          ? "border-amber-200 bg-amber-50 hover:bg-amber-400 hover:border-amber-400"
                          : "border-emerald-100 bg-emerald-50 hover:bg-emerald-500 hover:border-emerald-500"
                      }`}>
                      <span className={`text-sm font-black transition-colors ${urgent ? "text-amber-800 group-hover:text-white" : "text-emerald-800 group-hover:text-white"}`}>
                        {time}
                      </span>
                      <span className={`text-xs font-semibold mt-0.5 transition-colors ${urgent ? "text-amber-600 group-hover:text-white/80" : "text-emerald-600 group-hover:text-white/80"}`}>
                        €{tt.pricePerPlayer}
                      </span>
                      <div className={`flex items-center gap-0.5 text-xs mt-1 transition-colors ${urgent ? "text-amber-500 group-hover:text-white/70" : "text-slate-400 group-hover:text-white/70"}`}>
                        <Users className="w-2.5 h-2.5" />
                        <span>{spotsLeft}</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
