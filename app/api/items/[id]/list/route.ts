import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { listingPrice, listingUrl } = await req.json();

  if (listingPrice == null) {
    return NextResponse.json({ error: "listingPrice is required" }, { status: 400 });
  }

  const item = await prisma.item.findUnique({ where: { id }, include: { listing: true } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.$transaction([
    item.listing
      ? prisma.listing.update({
          where: { itemId: id },
          data: { listingPrice: parseFloat(listingPrice), listingUrl: listingUrl || null },
        })
      : prisma.listing.create({
          data: {
            itemId: id,
            listingPrice: parseFloat(listingPrice),
            listingUrl: listingUrl || null,
          },
        }),
    prisma.item.update({ where: { id }, data: { status: "LISTED" } }),
  ]);

  const updated = await prisma.item.findUnique({
    where: { id },
    include: { listing: true, sale: true },
  });
  return NextResponse.json(updated);
}
