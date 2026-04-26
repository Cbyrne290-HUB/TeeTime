import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const body = await req.json();

  const { teeTimeId, guestName, guestEmail, guestPhone, numberOfPlayers, needsTrolley, needsBuggy, notes } = body;

  if (!teeTimeId || !guestName || !guestEmail || !guestPhone || !numberOfPlayers) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const teeTime = await prisma.teeTime.findUnique({ where: { id: teeTimeId } });
  if (!teeTime || !teeTime.isAvailable) {
    return NextResponse.json({ error: "Tee time unavailable" }, { status: 409 });
  }

  const spotsLeft = teeTime.maxPlayers - teeTime.bookedCount;
  if (spotsLeft < numberOfPlayers) {
    return NextResponse.json({ error: "Not enough spots available" }, { status: 409 });
  }

  const totalPrice = teeTime.pricePerPlayer * numberOfPlayers;

  const [booking] = await prisma.$transaction([
    prisma.booking.create({
      data: {
        teeTimeId,
        userId: session?.user ? (session.user as { id?: string }).id ?? null : null,
        guestName,
        guestEmail,
        guestPhone,
        numberOfPlayers,
        needsTrolley: needsTrolley ?? false,
        needsBuggy: needsBuggy ?? false,
        notes: notes ?? null,
        totalPrice,
        status: "confirmed",
      },
    }),
    prisma.teeTime.update({
      where: { id: teeTimeId },
      data: {
        bookedCount: { increment: numberOfPlayers },
        isAvailable: teeTime.bookedCount + numberOfPlayers >= teeTime.maxPlayers ? false : true,
      },
    }),
  ]);

  return NextResponse.json(booking, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string }).id!;
  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: {
      teeTime: { include: { club: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}
