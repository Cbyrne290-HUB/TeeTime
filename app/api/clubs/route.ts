import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") ?? "0");
  const lng = parseFloat(searchParams.get("lng") ?? "0");
  const radius = parseFloat(searchParams.get("radius") ?? "50");
  const date = searchParams.get("date") ?? new Date().toISOString().split("T")[0];
  const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
  const players = searchParams.get("players") ? parseInt(searchParams.get("players")!) : 1;

  const dayStart = new Date(date + "T00:00:00.000Z");
  const dayEnd = new Date(date + "T23:59:59.999Z");

  const clubs = await prisma.golfClub.findMany({
    where: { isActive: true },
    include: {
      teeTimes: {
        where: {
          dateTime: { gte: dayStart, lte: dayEnd },
          isAvailable: true,
          ...(maxPrice ? { pricePerPlayer: { lte: maxPrice } } : {}),
        },
        orderBy: { dateTime: "asc" },
        take: 6,
      },
    },
  });

  const results = clubs
    .map((club) => {
      const dLat = ((club.lat - lat) * Math.PI) / 180;
      const dLng = ((club.lng - lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat * Math.PI) / 180) *
          Math.cos((club.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      const distance = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const available = club.teeTimes.filter(
        (tt) => tt.maxPlayers - tt.bookedCount >= players
      );

      return { ...club, distance, teeTimes: available };
    })
    .filter((c) => c.distance <= radius && c.teeTimes.length > 0)
    .sort((a, b) => a.distance - b.distance);

  return NextResponse.json(results);
}
