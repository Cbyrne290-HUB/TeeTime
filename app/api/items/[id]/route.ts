import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.item.findUnique({
    where: { id },
    include: { listing: true, sale: true },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { name, brand, category, condition, buyPrice, buyDate, notes, imageUrl } = body;

  const item = await prisma.item.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(brand !== undefined ? { brand } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(condition !== undefined ? { condition } : {}),
      ...(buyPrice !== undefined ? { buyPrice: parseFloat(buyPrice) } : {}),
      ...(buyDate !== undefined ? { buyDate: new Date(buyDate) } : {}),
      ...(notes !== undefined ? { notes } : {}),
      ...(imageUrl !== undefined ? { imageUrl } : {}),
    },
    include: { listing: true, sale: true },
  });

  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.item.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
