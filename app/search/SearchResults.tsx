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
  loading: () => <div className="w-full h-full skeleton rounded-xl" />,
});

type TeeTime = { id: string; dateTime: string; pricePerPlayer: number; maxPlayers: number; bookedCount: number };
type Club    = { id: string; name: string; slug: string; address: string; county: string; lat: number; lng: number; holes: number; par: number; distance: number; teeTimes: TeeTime[] };

// Stable course photo mapping per club slug
const COURSE_PHOTOS: Record<string, string> = {
  "the-k-club":      "https://images.unsplash.com/photo-1580889240911-aaebb021d2e1?w=600&h=260&fit=crop&q=80",
  "portmarnock":     "https://images.unsplash.com/photo-1535131398491-f8a9ef966e81?w=600&h=260&fit=crop&q=80",
  "royal-dublin":    "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&h=260&fit=crop&q=80",
  "druids-glen":     "https://images.unsplash.com/photo-1500932334442-8761ee4810a7?w=600&h=260&fit=crop&q=80",
  "mount-juliet":    "https://images.unsplash.com/photo-1592919505780-303950717480?w=600&h=260&fit=crop&q=80",
  "lahinch":         "https://images.unsplash.com/photo-1535131398491-f8a9ef966e81?w=600&h=260&fit=crop&q=80",
  "ballybunion":     "https://images.unsplash.com/photo-1561015011-4e2e7786fe3b?w=600&h=260&fit=crop&q=80",
  "old-head":        "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&h=260&fit=crop&q=80",
  "adare-manor":     "https://images.unsplash.com/photo-1580889240911-aaebb021d2e1?w=600&h=260&fit=crop&q=80",
  "powerscourt":     "https://images.unsplash.com/photo-1500932334442-8761ee4810a7?w=600&h=260&fit=crop&q=80",
  "doonbeg":         "https://images.unsplash.com/photo-1535131398491-f8a9ef966e81?w=600&h=260&fit=crop&q=80",
  "royal-portrush":  "https://images.unsplash.com/photo-1561015011-4e2e7786fe3b?w=600&h=260&fit=crop&q=80",
};
const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1592919505780-303950717480?w=600&h=260&fit=crop&q=80";

function getCoursePhoto(slug: string) {
  return COURSE_PHOTOS[slug] ?? DEFAULT_PHOTO;
}

export function SearchResults() {
  const sp = useSearchParams();
  const lat      = parseFloat(sp.get("lat")  ?? "53.3498");
  const lng      = parseFloat(sp.get("lng")  ?? "-6.2603");
  const date     = sp.get("date")     ?? new Date().toISOString().split("T")[0];
  const radius   = sp.get("radius")   ?? "200";
  const maxPrice = sp.get("maxPrice") ?? "";
  const players  = sp.get("players")  ?? "2";
  const location = sp.get("location") ?? "Ireland";

  const [clubs,   setClubs]   = useState<Club[]>([]);
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
    <div className="min-h-screen bg-gray-50">
      {/* Search bar strip */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <SearchForm compact />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">
            {loading ? "Searching..." : `${clubs.length} club${clubs.length !== 1 ? "s" : ""} available`}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {displayDate} &middot; within {radius} km of {location} &middot; {players} player{parseInt(players) !== 1 ? "s" : ""}
            {maxPrice ? ` &middot; max €${maxPrice}/player` : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Club cards */}
          <div className="lg:col-span-3 space-y-5">
            {loading && [...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-64 rounded-2xl" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}

            {!loading && clubs.length === 0 && (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                <Flag className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-800 font-bold text-lg">No clubs found</p>
                <p className="text-gray-400 text-sm mt-1">Try selecting a wider region or a different date</p>
              </div>
            )}

            {clubs.map((club, i) => (
              <motion.div key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}>
                <ClubCard club={club} date={date} players={players} />
              </motion.div>
            ))}
          </div>

          {/* Map */}
          <div className="hidden lg:block lg:col-span-2 sticky top-20 h-[calc(100vh-100px)] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <ClubMap clubs={clubs} centerLat={lat} centerLng={lng} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ClubCard({ club, date, players }: { club: Club; date: string; players: string }) {
  const availableSlots = club.teeTimes.filter(tt => tt.maxPlayers - tt.bookedCount > 0);
  const allSlots = club.teeTimes.slice(0, 6);
  const minPrice = availableSlots.length > 0 ? Math.min(...availableSlots.map(t => t.pricePerPlayer)) : club.teeTimes[0]?.pricePerPlayer ?? 0;
  const photo = getCoursePhoto(club.slug);

  return (
    <TiltCard className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all">
      {/* Course photo header */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={photo}
          alt={club.name}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* Club name on image */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <h2 className="font-black text-white text-lg leading-tight drop-shadow">{club.name}</h2>
            <div className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
              <MapPin className="w-3 h-3" />
              <span>{club.county} &middot; {club.distance.toFixed(1)} km away</span>
            </div>
          </div>
          {availableSlots.length > 0 && (
            <div className="text-right">
              <div className="text-white/60 text-xs">from</div>
              <div className="text-white font-black text-xl leading-none">€{minPrice}</div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Club details row */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1"><Flag className="w-3.5 h-3.5 text-green-600" />{club.holes} holes · Par {club.par}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-green-600" />{club.teeTimes.length} slots today</span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />4.8
          </span>
        </div>

        {/* Tee time slots */}
        <div className="flex flex-wrap gap-2 mb-4">
          {allSlots.map((tt) => {
            const time = new Date(tt.dateTime).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" });
            const spotsLeft = tt.maxPlayers - tt.bookedCount;
            const isBooked = spotsLeft <= 0;
            const isUrgent = spotsLeft === 1;

            if (isBooked) {
              return (
                <div key={tt.id}
                  className="flex flex-col items-center border-2 border-red-100 bg-red-50 rounded-xl px-3 py-2 cursor-not-allowed">
                  <span className="text-sm font-bold text-red-400">{time}</span>
                  <span className="text-xs text-red-500 font-semibold">Fully Booked</span>
                </div>
              );
            }

            return (
              <Link key={tt.id}
                href={`/book/${tt.id}?date=${date}&players=${players}&clubSlug=${club.slug}`}
                className={`group flex flex-col items-center rounded-xl px-3 py-2 transition-all duration-200 border-2 ${
                  isUrgent
                    ? "border-orange-300 bg-orange-50 hover:bg-orange-500 hover:border-orange-500"
                    : "border-green-200 bg-green-50 hover:bg-green-700 hover:border-green-700"
                }`}>
                <span className={`text-sm font-black transition-colors ${isUrgent ? "text-orange-700 group-hover:text-white" : "text-green-800 group-hover:text-white"}`}>{time}</span>
                <span className={`text-xs font-medium transition-colors ${isUrgent ? "text-orange-600 group-hover:text-white/80" : "text-green-700 group-hover:text-white/80"}`}>
                  {isUrgent ? "1 spot left" : `€${tt.pricePerPlayer}`}
                </span>
              </Link>
            );
          })}
        </div>

        <Link href={`/clubs/${club.slug}?date=${date}&players=${players}`}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 border-2 border-gray-200 hover:border-green-700 text-gray-600 hover:text-white hover:bg-green-700 rounded-xl text-sm font-bold transition-all duration-200">
          <Layers className="w-4 h-4" /> View All Times <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </TiltCard>
  );
}
