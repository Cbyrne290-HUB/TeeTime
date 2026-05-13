import { prisma } from "./prisma";
import { addDays, startOfDay, addMinutes, parseISO, format } from "date-fns";

// Generates tee time slots from a schedule for a given date range
export async function generateTeeTimesForClub(
  clubId: string,
  fromDate: Date,
  toDate: Date
) {
  const schedules = await prisma.teeTimeSchedule.findMany({
    where: {
      clubId,
      isActive: true,
      validFrom: { lte: toDate },
      OR: [{ validTo: null }, { validTo: { gte: fromDate } }],
    },
  });

  const created: string[] = [];

  for (const schedule of schedules) {
    const days: number[] = JSON.parse(schedule.daysOfWeek);
    let cursor = startOfDay(fromDate);

    while (cursor <= toDate) {
      const dayOfWeek = cursor.getDay(); // 0=Sun, 1=Mon...
      if (days.includes(dayOfWeek)) {
        const [startH, startM] = schedule.startTime.split(":").map(Number);
        const [endH, endM] = schedule.endTime.split(":").map(Number);

        let slotTime = new Date(cursor);
        slotTime.setHours(startH, startM, 0, 0);
        const endTime = new Date(cursor);
        endTime.setHours(endH, endM, 0, 0);

        while (slotTime < endTime) {
          try {
            await prisma.teeTime.upsert({
              where: { clubId_dateTime: { clubId, dateTime: slotTime } },
              create: {
                clubId,
                scheduleId: schedule.id,
                dateTime: new Date(slotTime),
                maxPlayers: schedule.maxPlayers,
                pricePerPlayer: schedule.pricePerPlayer,
                isAvailable: true,
              },
              update: {},
            });
            created.push(slotTime.toISOString());
          } catch {
            // skip duplicate
          }
          slotTime = addMinutes(slotTime, schedule.intervalMins);
        }
      }
      cursor = addDays(cursor, 1);
    }
  }

  return created.length;
}

export async function searchTeeTimes({
  lat,
  lng,
  radiusKm,
  date,
  maxPricePerPlayer,
  players,
}: {
  lat: number;
  lng: number;
  radiusKm: number;
  date: string;
  maxPricePerPlayer?: number;
  players?: number;
}) {
  const targetDate = parseISO(date);
  const dayStart = startOfDay(targetDate);
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000 - 1);

  const clubs = await prisma.golfClub.findMany({
    where: { isActive: true },
    include: {
      teeTimes: {
        where: {
          dateTime: { gte: dayStart, lte: dayEnd },
          isAvailable: true,
          ...(maxPricePerPlayer ? { pricePerPlayer: { lte: maxPricePerPlayer } } : {}),
        },
        orderBy: { dateTime: "asc" },
      },
    },
  });

  // Filter by radius using Haversine
  const results = clubs
    .map((club) => {
      const dLat = ((club.lat - lat) * Math.PI) / 180;
      const dLng = ((club.lng - lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat * Math.PI) / 180) *
          Math.cos((club.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      const distance = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const availableTeeTimes = club.teeTimes.filter(
        (tt) => tt.maxPlayers - tt.bookedCount >= (players ?? 1)
      );

      return { ...club, distance, teeTimes: availableTeeTimes };
    })
    .filter((club) => club.distance <= radiusKm && club.teeTimes.length > 0)
    .sort((a, b) => a.distance - b.distance);

  return results;
}
