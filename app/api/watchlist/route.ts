import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.watchlistItem.findMany({ orderBy: [{ isActive: "desc" }, { createdAt: "desc" }] });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const { keywords, category, maxPrice, notes } = await req.json();
  if (!keywords || !category || maxPrice == null) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  const item = await prisma.watchlistItem.create({ data: { keywords, category, maxPrice: parseFloat(maxPrice), notes: notes || null, isActive: true } });
  return NextResponse.json(item, { status: 201 });
}
