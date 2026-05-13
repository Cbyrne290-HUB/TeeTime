import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateTeeTimesForClub } from "@/lib/tee-times";
import { addDays, startOfDay } from "date-fns";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string; clubId?: string } | undefined;

  if (!session || (user?.role !== "club_admin" && user?.role !== "super_admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clubId, daysAhead = 30 } = await req.json();
  const targetClubId = user?.role === "super_admin" ? clubId : user?.clubId;

  if (!targetClubId) return NextResponse.json({ error: "No club" }, { status: 400 });

  const from = startOfDay(new Date());
  const to = addDays(from, daysAhead);

  const count = await generateTeeTimesForClub(targetClubId, from, to);
  return NextResponse.json({ generated: count });
}
