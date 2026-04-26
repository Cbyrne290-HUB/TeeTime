import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") ?? new Date().toISOString().split("T")[0];

  const dayStart = new Date(date + "T00:00:00.000Z");
  const dayEnd = new Date(date + "T23:59:59.999Z");

  const club = await prisma.golfClub.findFirst({
    where: { OR: [{ id }, { slug: id }], isActive: true },
    include: {
      teeTimes: {
        where: {
          dateTime: { gte: dayStart, lte: dayEnd },
          isAvailable: true,
        },
        orderBy: { dateTime: "asc" },
      },
    },
  });

  if (!club) return NextResponse.json({ error: "Club not found" }, { status: 404 });
  return NextResponse.json(club);
}
