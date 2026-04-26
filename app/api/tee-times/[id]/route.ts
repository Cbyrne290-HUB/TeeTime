import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teeTime = await prisma.teeTime.findUnique({
    where: { id },
    include: { club: true },
  });
  if (!teeTime) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(teeTime);
}
