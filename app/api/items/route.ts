import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");

  const items = await prisma.item.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(category ? { category } : {}),
    },
    include: { listing: true, sale: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, brand, category, condition, buyPrice, buyDate, notes, imageUrl } = body;

  if (!name || !category || !condition || buyPrice == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const item = await prisma.item.create({
    data: {
      name,
      brand: brand || null,
      category,
      condition,
      buyPrice: parseFloat(buyPrice),
      buyDate: buyDate ? new Date(buyDate) : new Date(),
      notes: notes || null,
      imageUrl: imageUrl || null,
      status: "BOUGHT",
    },
  });

  return NextResponse.json(item, { status: 201 });
}
