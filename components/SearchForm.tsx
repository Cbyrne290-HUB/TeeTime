"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Users, Euro, Locate } from "lucide-react";

export function SearchForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [location, setLocation] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [date, setDate] = useState(today);
  const [radius, setRadius] = useState("20");
  const [maxPrice, setMaxPrice] = useState("");
  const [players, setPlayers] = useState("2");
  const [locating, setLocating] = useState(false);

  function useMyLocation() {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toString());
        setLng(pos.coords.longitude.toString());
        setLocation("My Location");
        setLocating(false);
      },
      () => { setLocating(false); alert("Location unavailable. Enter a location manually."); }
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      lat: lat || "53.3498",
      lng: lng || "-6.2603",
      location: location || "Ireland",
      date, radius, players,
      ...(maxPrice ? { maxPrice } : {}),
    });
    router.push(`/search?${params}`);
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-end">
        <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)}
          className="flex-1 min-w-[130px] border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        <select value={radius} onChange={(e) => setRadius(e.target.value)}
          className="flex-1 min-w-[100px] border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500">
          {[10, 20, 30, 50].map((r) => <option key={r} value={r}>{r} km</option>)}
        </select>
        <button type="submit"
          className="btn-emerald text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5">
          <Search className="w-4 h-4" /> Search
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="text-slate-800">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">

        {/* Location */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Where</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Dublin, Cork, Galway…" value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder:text-slate-400" />
            </div>
            <button type="button" onClick={useMyLocation} disabled={locating}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-colors whitespace-nowrap">
              <Locate className="w-4 h-4" />
              <span className="hidden sm:block">{locating ? "…" : "Near me"}</span>
            </button>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Date</label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)}
              className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" />
          </div>
        </div>

        {/* Players */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Players</label>
          <div className="relative">
            <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select value={players} onChange={(e) => setPlayers(e.target.value)}
              className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 appearance-none">
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} {n === 1 ? "player" : "players"}</option>)}
            </select>
          </div>
        </div>

        {/* Radius */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Radius</label>
          <select value={radius} onChange={(e) => setRadius(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800">
            {[10, 20, 30, 50, 100].map((r) => <option key={r} value={r}>Within {r} km</option>)}
          </select>
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Max price / player</label>
          <div className="relative">
            <Euro className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="number" placeholder="No limit" value={maxPrice} min={0} max={500}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder:text-slate-400" />
          </div>
        </div>
      </div>

      <button type="submit"
        className="btn-gold w-full text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-base tracking-wide">
        <Search className="w-5 h-5" /> Find Tee Times
      </button>
    </form>
  );
}
