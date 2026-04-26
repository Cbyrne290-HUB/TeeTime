"use client";
import { useEffect, useRef } from "react";

type Club = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  slug: string;
  distance: number;
  teeTimes: { pricePerPlayer: number }[];
};

export function ClubMap({ clubs, centerLat, centerLng }: { clubs: Club[]; centerLat: number; centerLng: number }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      // Fix default marker icons in Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!).setView([centerLat, centerLng], 10);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Centre marker (user location)
      L.circleMarker([centerLat, centerLng], {
        radius: 8,
        fillColor: "#166534",
        color: "#fff",
        weight: 2,
        fillOpacity: 1,
      })
        .addTo(map)
        .bindPopup("Your location");

      // Club markers
      clubs.forEach((club) => {
        const minPrice = Math.min(...club.teeTimes.map((t) => t.pricePerPlayer));
        const popup = `
          <div style="min-width:160px">
            <strong style="color:#166534">${club.name}</strong><br/>
            <span style="font-size:12px;color:#6b7280">${club.distance.toFixed(1)} km away</span><br/>
            <span style="font-size:13px;font-weight:600">From €${minPrice}</span><br/>
            <a href="/clubs/${club.slug}" style="color:#166534;font-size:12px">View tee times →</a>
          </div>
        `;
        L.marker([club.lat, club.lng]).addTo(map).bindPopup(popup);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mapRef} className="w-full h-full" />;
}
