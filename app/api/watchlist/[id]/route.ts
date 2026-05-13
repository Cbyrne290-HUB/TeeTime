import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const item = await prisma.watchlistItem.update({
    where: { id },
    data: {
      ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
      ...(body.keywords !== undefined ? { keywords: body.keywords } : {}),
      ...(body.maxPrice !== undefined ? { maxPrice: parseFloat(body.maxPrice) } : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
    },
  });

  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.watchlistItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
