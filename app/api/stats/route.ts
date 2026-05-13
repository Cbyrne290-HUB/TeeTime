import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [items, sales] = await Promise.all([
    prisma.item.findMany({ include: { sale: true } }),
    prisma.sale.findMany(),
  ]);

  const totalItems = items.length;
  const bought = items.filter((i) => i.status === "BOUGHT").length;
  const listed = items.filter((i) => i.status === "LISTED").length;
  const sold = items.filter((i) => i.status === "SOLD").length;

  const totalSpent = items.reduce((s, i) => s + i.buyPrice, 0);
  const totalRevenue = sales.reduce((s, sale) => s + sale.salePrice, 0);
  const totalProfit = sales.reduce((s, sale) => s + sale.profit, 0);
  const avgProfit = sold > 0 ? totalProfit / sold : 0;
  const roi = totalSpent > 0 ? (totalProfit / totalSpent) * 100 : 0;

  const recentSales = await prisma.sale.findMany({
    take: 5,
    orderBy: { saleDate: "desc" },
    include: { item: true },
  });

  const topCategories = await prisma.item.groupBy({
    by: ["category"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  return NextResponse.json({
    totalItems,
    bought,
    listed,
    sold,
    totalSpent,
    totalRevenue,
    totalProfit,
    avgProfit,
    roi,
    recentSales,
    topCategories,
  });
}
