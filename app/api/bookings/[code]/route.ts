import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const booking = await prisma.booking.findFirst({
    where: {
      OR: [{ confirmationCode: code }, { id: code }],
    },
    include: {
      teeTime: { include: { club: true } },
    },
  });

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  return NextResponse.json(booking);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { status } = await req.json();

  const booking = await prisma.booking.findFirst({
    where: { OR: [{ confirmationCode: code }, { id: code }] },
    include: { teeTime: true },
  });

  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.$transaction([
    prisma.booking.update({ where: { id: booking.id }, data: { status } }),
    ...(status === "cancelled"
      ? [
          prisma.teeTime.update({
            where: { id: booking.teeTimeId },
            data: {
              bookedCount: { decrement: booking.numberOfPlayers },
              isAvailable: true,
            },
          }),
        ]
      : []),
  ]);

  return NextResponse.json({ success: true });
}
