import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { salePrice, platformFee = 0, shippingCost = 0, saleDate } = await req.json();

  if (salePrice == null) {
    return NextResponse.json({ error: "salePrice is required" }, { status: 400 });
  }

  const item = await prisma.item.findUnique({ where: { id }, include: { sale: true } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const sp = parseFloat(salePrice);
  const pf = parseFloat(platformFee);
  const sc = parseFloat(shippingCost);
  const profit = sp - pf - sc - item.buyPrice;

  await prisma.$transaction([
    item.sale
      ? prisma.sale.update({
          where: { itemId: id },
          data: {
            salePrice: sp,
            platformFee: pf,
            shippingCost: sc,
            profit,
            saleDate: saleDate ? new Date(saleDate) : new Date(),
          },
        })
      : prisma.sale.create({
          data: {
            itemId: id,
            salePrice: sp,
            platformFee: pf,
            shippingCost: sc,
            profit,
            saleDate: saleDate ? new Date(saleDate) : new Date(),
          },
        }),
    prisma.item.update({ where: { id }, data: { status: "SOLD" } }),
  ]);

  const updated = await prisma.item.findUnique({
    where: { id },
    include: { listing: true, sale: true },
  });
  return NextResponse.json(updated);
}
