import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.item.findUnique({ where: { id }, include: { listing: true, sale: true } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const item = await prisma.item.update({
    where: { id },
    data: {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.brand !== undefined ? { brand: body.brand } : {}),
      ...(body.category !== undefined ? { category: body.category } : {}),
      ...(body.condition !== undefined ? { condition: body.condition } : {}),
      ...(body.buyPrice !== undefined ? { buyPrice: parseFloat(body.buyPrice) } : {}),
      ...(body.buyDate !== undefined ? { buyDate: new Date(body.buyDate) } : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
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
