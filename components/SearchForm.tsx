"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Users, Euro } from "lucide-react";

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
      () => {
        setLocating(false);
        alert("Could not get your location. Please enter a location manually.");
      }
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      lat: lat || "53.3498",
      lng: lng || "-6.2603",
      location: location || "Dublin",
      date,
      radius,
      players,
      ...(maxPrice ? { maxPrice } : {}),
    });
    router.push(`/search?${params}`);
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[140px]">
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800"
          />
        </div>
        <div className="flex-1 min-w-[100px]">
          <select
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800"
          >
            <option value="10">10 km</option>
            <option value="20">20 km</option>
            <option value="30">30 km</option>
            <option value="50">50 km</option>
          </select>
        </div>
        <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-1">
          <Search className="w-4 h-4" /> Search
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="text-gray-800">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Location */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Location
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. Dublin, Cork, Galway…"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="button"
              onClick={useMyLocation}
              disabled={locating}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              {locating ? "…" : "Use my location"}
            </button>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Players */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Players</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={players}
              onChange={(e) => setPlayers(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? "player" : "players"}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Radius */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Radius</label>
          <select
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="10">Within 10 km</option>
            <option value="20">Within 20 km</option>
            <option value="30">Within 30 km</option>
            <option value="50">Within 50 km</option>
            <option value="100">Within 100 km</option>
          </select>
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Max price per player
          </label>
          <div className="relative">
            <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              placeholder="No limit"
              value={maxPrice}
              min={0}
              max={500}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-green-700 hover:bg-green-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-base"
      >
        <Search className="w-5 h-5" />
        Find Tee Times
      </button>
    </form>
  );
}
