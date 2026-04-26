"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { MapPin, Clock, Users, Euro, Flag, ChevronRight } from "lucide-react";
import { SearchForm } from "@/components/SearchForm";

const ClubMap = dynamic(() => import("@/components/ClubMap").then((m) => m.ClubMap), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-green-50 animate-pulse rounded-xl" />,
});

type TeeTime = { id: string; dateTime: string; pricePerPlayer: number; maxPlayers: number; bookedCount: number };
type Club = { id: string; name: string; slug: string; address: string; county: string; lat: number; lng: number; holes: number; distance: number; teeTimes: TeeTime[] };

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
    <div>
      {/* Refined search bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <SearchForm compact />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-800">
            {loading ? "Searching…" : `${clubs.length} club${clubs.length !== 1 ? "s" : ""} found`}
          </h1>
          <p className="text-sm text-gray-500">
            {displayDate} · within {radius} km of {location} · {players} player{parseInt(players) !== 1 ? "s" : ""}
            {maxPrice ? ` · max €${maxPrice}` : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Results list */}
          <div className="space-y-4">
            {loading && (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse h-40" />
              ))
            )}

            {!loading && clubs.length === 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <Flag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No clubs found</p>
                <p className="text-sm text-gray-400 mt-1">Try increasing the radius or changing the date</p>
              </div>
            )}

            {clubs.map((club) => {
              const minPrice = Math.min(...club.teeTimes.map((t) => t.pricePerPlayer));
              const slots = club.teeTimes.slice(0, 4);
              return (
                <div key={club.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h2 className="font-bold text-gray-900 text-lg leading-tight">{club.name}</h2>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{club.county} · {club.distance.toFixed(1)} km away</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">from</div>
                        <div className="text-lg font-bold text-green-700">€{minPrice}</div>
                        <div className="text-xs text-gray-400">per player</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><Flag className="w-3 h-3" />{club.holes} holes</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{club.teeTimes.length} slots available</span>
                    </div>

                    {/* Tee time quick-pick */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {slots.map((tt) => (
                        <Link
                          key={tt.id}
                          href={`/book/${tt.id}?date=${date}&players=${players}`}
                          className="flex flex-col items-center bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl px-3 py-2 transition-colors group"
                        >
                          <span className="text-sm font-semibold text-green-800">
                            {new Date(tt.dateTime).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <span className="text-xs text-green-600">€{tt.pricePerPlayer}</span>
                        </Link>
                      ))}
                    </div>

                    <Link
                      href={`/clubs/${club.slug}?date=${date}&players=${players}`}
                      className="flex items-center justify-center gap-1 w-full py-2 border border-green-700 text-green-700 rounded-xl text-sm font-medium hover:bg-green-700 hover:text-white transition-colors"
                    >
                      View all times <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map */}
          <div className="hidden lg:block sticky top-20 h-[calc(100vh-120px)] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <ClubMap clubs={clubs} centerLat={lat} centerLng={lng} />
          </div>
        </div>
      </div>
    </div>
  );
}
