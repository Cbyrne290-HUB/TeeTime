import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string; clubId?: string } | undefined;
  if (!session || !user?.clubId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const schedules = await prisma.teeTimeSchedule.findMany({
    where: { clubId: user.clubId },
    orderBy: { validFrom: "desc" },
  });
  return NextResponse.json(schedules);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string; clubId?: string } | undefined;
  if (!session || !user?.clubId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const schedule = await prisma.teeTimeSchedule.create({
    data: {
      clubId: user.clubId,
      name: body.name,
      daysOfWeek: JSON.stringify(body.daysOfWeek),
      startTime: body.startTime,
      endTime: body.endTime,
      intervalMins: body.intervalMins ?? 10,
      maxPlayers: body.maxPlayers ?? 4,
      pricePerPlayer: body.pricePerPlayer,
      validFrom: new Date(body.validFrom),
      validTo: body.validTo ? new Date(body.validTo) : null,
    },
  });
  return NextResponse.json(schedule, { status: 201 });
}
