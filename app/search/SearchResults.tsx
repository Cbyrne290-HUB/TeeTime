"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, Flag, ChevronRight, Star, Layers } from "lucide-react";
import { SearchForm } from "@/components/SearchForm";
import { TiltCard } from "@/components/TiltCard";

const ClubMap = dynamic(() => import("@/components/ClubMap").then((m) => m.ClubMap), {
  ssr: false,
  loading: () => <div className="w-full h-full skeleton rounded-2xl" />,
});

type TeeTime = { id: string; dateTime: string; pricePerPlayer: number; maxPlayers: number; bookedCount: number };
type Club = { id: string; name: string; slug: string; address: string; county: string; lat: number; lng: number; holes: number; par: number; distance: number; teeTimes: TeeTime[] };

const COUNTY_COLORS: Record<string, string> = {
  Dublin: "from-blue-600 to-indigo-700",
  Kildare: "from-emerald-600 to-teal-700",
  Wicklow: "from-green-600 to-emerald-700",
  Kerry: "from-amber-600 to-orange-700",
  Cork: "from-red-600 to-rose-700",
  Clare: "from-violet-600 to-purple-700",
  Kilkenny: "from-slate-600 to-gray-700",
  Limerick: "from-cyan-600 to-sky-700",
  Sligo: "from-teal-600 to-cyan-700",
  Galway: "from-orange-600 to-amber-700",
  Derry: "from-pink-600 to-rose-700",
  Antrim: "from-indigo-600 to-violet-700",
};

function getGradient(county: string) {
  return COUNTY_COLORS[county] ?? "from-slate-600 to-gray-700";
}

export function SearchResults() {
  const sp = useSearchParams();
  const lat = parseFloat(sp.get("lat") ?? "53.3498");
  const lng = parseFloat(sp.get("lng") ?? "-6.2603");
  const date = sp.get("date") ?? new Date().toISOString().split("T")[0];
  const radius = sp.get("radius") ?? "20";
  const maxPrice = sp.get("maxPrice") ?? "";
  const players = sp.get("players") ?? "1";
  const location = sp.get("location") ?? "Ireland";

  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ lat: lat.toString(), lng: lng.toString(), date, radius, players, ...(maxPrice ? { maxPrice } : {}) });
    fetch(`/api/clubs?${params}`)
      .then((r) => r.json())
      .then((data) => { setClubs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [lat, lng, date, radius, maxPrice, players]);

  const displayDate = new Date(date + "T12:00:00").toLocaleDateString("en-IE", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search bar strip */}
      <div className="bg-slate-900 border-b border-white/8 px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <SearchForm compact />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900">
            {loading ? "Searching…" : `${clubs.length} club${clubs.length !== 1 ? "s" : ""} found`}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {displayDate} · {radius} km of {location} · {players} player{parseInt(players) !== 1 ? "s" : ""}
            {maxPrice ? ` · max €${maxPrice}/player` : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            {loading && [...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-52 rounded-2xl" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}

            {!loading && clubs.length === 0 && (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
                <Flag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-700 font-bold text-lg">No clubs found</p>
                <p className="text-slate-400 text-sm mt-1">Try a bigger radius or different date</p>
              </div>
            )}

            {clubs.map((club, i) => (
              <motion.div key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}>
                <ClubCard club={club} date={date} players={players} />
              </motion.div>
            ))}
          </div>

          {/* Map */}
          <div className="hidden lg:block lg:col-span-2 sticky top-20 h-[calc(100vh-100px)] rounded-2xl overflow-hidden shadow-md border border-slate-200">
            <ClubMap clubs={clubs} centerLat={lat} centerLng={lng} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ClubCard({ club, date, players }: { club: Club; date: string; players: string }) {
  const minPrice = Math.min(...club.teeTimes.map((t) => t.pricePerPlayer));
  const slots = club.teeTimes.slice(0, 5);
  const gradient = getGradient(club.county);

  return (
    <TiltCard className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:border-emerald-200 transition-colors">
      {/* Club header strip */}
      <div className={`bg-gradient-to-r ${gradient} px-5 py-4 flex items-center justify-between`}>
        <div>
          <h2 className="font-black text-white text-lg leading-tight">{club.name}</h2>
          <div className="flex items-center gap-1.5 text-white/70 text-sm mt-0.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{club.county} · {club.distance.toFixed(1)} km</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white/70 text-xs">from</div>
          <div className="text-white font-black text-2xl">€{minPrice}</div>
          <div className="text-white/60 text-xs">per player</div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1"><Flag className="w-3.5 h-3.5 text-emerald-500" />{club.holes} holes · Par {club.par}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-500" />{club.teeTimes.length} slots</span>
          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />4.7</span>
        </div>

        {/* Tee time quick-pick */}
        <div className="flex flex-wrap gap-2 mb-4">
          {slots.map((tt) => {
            const time = new Date(tt.dateTime).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" });
            return (
              <Link key={tt.id} href={`/book/${tt.id}?date=${date}&players=${players}&clubSlug=${club.slug}`}
                className="group flex flex-col items-center border-2 border-emerald-100 hover:border-emerald-400 bg-emerald-50 hover:bg-emerald-400 rounded-xl px-3 py-2 transition-all duration-200">
                <span className="text-sm font-black text-emerald-800 group-hover:text-white transition-colors">{time}</span>
                <span className="text-xs text-emerald-600 group-hover:text-white/80 transition-colors font-medium">€{tt.pricePerPlayer}</span>
              </Link>
            );
          })}
        </div>

        <Link href={`/clubs/${club.slug}?date=${date}&players=${players}`}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 border-2 border-slate-200 hover:border-slate-900 text-slate-600 hover:text-slate-900 hover:bg-slate-900 hover:text-white rounded-xl text-sm font-bold transition-all duration-200">
          <Layers className="w-4 h-4" /> All available times <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </TiltCard>
  );
}
