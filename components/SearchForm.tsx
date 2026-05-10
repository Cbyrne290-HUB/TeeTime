"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Users, SlidersHorizontal, Locate } from "lucide-react";

const LOCATIONS = [
  { label: "Anywhere in Ireland", lat: 53.1424, lng: -7.6921, radius: 300 },
  { label: "Dublin",              lat: 53.3498, lng: -6.2603, radius: 80  },
  { label: "Cork",                lat: 51.8985, lng: -8.4756, radius: 80  },
  { label: "Kerry",               lat: 52.1545, lng: -9.5669, radius: 80  },
  { label: "Galway",              lat: 53.2707, lng: -9.0568, radius: 80  },
  { label: "Limerick",            lat: 52.6638, lng: -8.6267, radius: 80  },
  { label: "Clare",               lat: 52.9336, lng: -9.3443, radius: 80  },
  { label: "Wicklow",             lat: 52.9808, lng: -6.0444, radius: 80  },
  { label: "Kildare",             lat: 53.1547, lng: -6.9091, radius: 60  },
  { label: "Kilkenny",            lat: 52.6541, lng: -7.2448, radius: 80  },
  { label: "Sligo",               lat: 54.2766, lng: -8.4761, radius: 80  },
  { label: "Antrim / Belfast",    lat: 54.5973, lng: -5.9301, radius: 80  },
];

const PLAYER_OPTIONS = [1, 2, 3, 4];
const PRICE_OPTIONS  = [
  { label: "Any price",      value: "" },
  { label: "Up to €50",     value: "50" },
  { label: "Up to €75",     value: "75" },
  { label: "Up to €100",    value: "100" },
  { label: "Up to €150",    value: "150" },
  { label: "Up to €200",    value: "200" },
];

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all";
const selectCls = `${inputCls} select-custom cursor-pointer`;

export function SearchForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [locationIdx, setLocationIdx] = useState(0);
  const [date,       setDate]       = useState(today);
  const [players,    setPlayers]    = useState(2);
  const [maxPrice,   setMaxPrice]   = useState("");
  const [locating,   setLocating]   = useState(false);
  const [customLat,  setCustomLat]  = useState<number | null>(null);
  const [customLng,  setCustomLng]  = useState<number | null>(null);

  const selectedLoc = LOCATIONS[locationIdx];

  function useMyLocation() {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCustomLat(pos.coords.latitude);
        setCustomLng(pos.coords.longitude);
        setLocationIdx(-1);
        setLocating(false);
      },
      () => { setLocating(false); }
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const lat = customLat ?? selectedLoc?.lat ?? 53.3498;
    const lng = customLng ?? selectedLoc?.lng ?? -6.2603;
    const radius = selectedLoc?.radius ?? 200;
    const location = locationIdx === -1 ? "My Location" : (selectedLoc?.label ?? "Ireland");

    const params = new URLSearchParams({
      lat: lat.toString(), lng: lng.toString(),
      location, date,
      radius: radius.toString(),
      players: players.toString(),
      ...(maxPrice ? { maxPrice } : {}),
    });
    router.push(`/search?${params}`);
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-end">
        <select
          value={locationIdx}
          onChange={(e) => { setLocationIdx(parseInt(e.target.value)); setCustomLat(null); setCustomLng(null); }}
          className="flex-1 min-w-[160px] border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 select-custom">
          {LOCATIONS.map((l, i) => <option key={l.label} value={i}>{l.label}</option>)}
        </select>
        <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)}
          className="flex-1 min-w-[140px] border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600" />
        <button type="submit" className="btn-primary px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5">
          <Search className="w-4 h-4" /> Search
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Location */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
          <MapPin className="inline w-3.5 h-3.5 mr-1" />Where
        </label>
        <div className="flex gap-2">
          <select
            value={locationIdx}
            onChange={(e) => { setLocationIdx(parseInt(e.target.value)); setCustomLat(null); setCustomLng(null); }}
            className={`flex-1 ${selectCls}`}>
            {LOCATIONS.map((l, i) => <option key={l.label} value={i}>{l.label}</option>)}
            {locationIdx === -1 && <option value={-1}>My Location</option>}
          </select>
          <button type="button" onClick={useMyLocation} disabled={locating}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-green-50 hover:border-green-400 hover:text-green-700 transition-colors font-medium whitespace-nowrap">
            <Locate className="w-4 h-4" />
            <span className="hidden sm:inline">{locating ? "Locating..." : "Near me"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Date */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
            <Calendar className="inline w-3.5 h-3.5 mr-1" />Date
          </label>
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls} />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
            <SlidersHorizontal className="inline w-3.5 h-3.5 mr-1" />Max price
          </label>
          <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={selectCls}>
            {PRICE_OPTIONS.map((p) => <option key={p.label} value={p.value}>{p.label}</option>)}
          </select>
        </div>
      </div>

      {/* Players */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
          <Users className="inline w-3.5 h-3.5 mr-1" />Players
        </label>
        <div className="flex gap-2">
          {PLAYER_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPlayers(n)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                players === n
                  ? "bg-green-700 border-green-700 text-white"
                  : "bg-white border-gray-200 text-gray-700 hover:border-green-600 hover:text-green-700"
              }`}>
              {n} {n === 1 ? "player" : "players"}
            </button>
          ))}
        </div>
      </div>

      <button type="submit"
        className="btn-primary w-full py-4 rounded-xl text-base font-black flex items-center justify-center gap-2">
        <Search className="w-5 h-5" /> Find Tee Times
      </button>
    </form>
  );
}
