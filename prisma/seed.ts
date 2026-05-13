import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import { addDays, startOfDay, addMinutes } from "date-fns";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const clubs = [
  {
    name: "The K Club",
    slug: "the-k-club",
    description: "Home of the 2006 Ryder Cup. Two championship courses set in 550 acres of stunning Kildare parkland.",
    address: "Straffan, Co. Kildare",
    county: "Kildare",
    lat: 53.3047, lng: -6.6361,
    phone: "+353 1 601 7300",
    email: "golf@kclub.ie",
    website: "https://www.kclub.ie",
    holes: 18, par: 72,
  },
  {
    name: "Portmarnock Golf Club",
    slug: "portmarnock",
    description: "One of the world's greatest links courses, set on a peninsula north of Dublin. Host of numerous Irish Opens.",
    address: "Portmarnock, Co. Dublin",
    county: "Dublin",
    lat: 53.4225, lng: -6.1402,
    phone: "+353 1 846 2968",
    email: "office@portmarnockgolfclub.ie",
    website: "https://www.portmarnockgolfclub.ie",
    holes: 18, par: 72,
  },
  {
    name: "Royal Dublin Golf Club",
    slug: "royal-dublin",
    description: "A classic links on Bull Island in Dublin Bay, established in 1885 and one of Ireland's oldest clubs.",
    address: "Bull Island, Dollymount, Dublin 3",
    county: "Dublin",
    lat: 53.3695, lng: -6.1740,
    phone: "+353 1 833 6346",
    email: "info@theroyaldublingolfclub.com",
    website: "https://www.theroyaldublingolfclub.com",
    holes: 18, par: 73,
  },
  {
    name: "Druids Glen Golf Resort",
    slug: "druids-glen",
    description: "The Augusta of Europe — four-time host of the Irish Open, set in the beautiful Wicklow countryside.",
    address: "Newtownmountkennedy, Co. Wicklow",
    county: "Wicklow",
    lat: 53.0983, lng: -6.1174,
    phone: "+353 1 287 3600",
    email: "golf@druidsglen.ie",
    website: "https://www.druidsglenresort.com",
    holes: 18, par: 71,
  },
  {
    name: "Mount Juliet Estate",
    slug: "mount-juliet",
    description: "Jack Nicklaus-designed championship course set within a 1,500-acre estate in Co. Kilkenny.",
    address: "Thomastown, Co. Kilkenny",
    county: "Kilkenny",
    lat: 52.5223, lng: -7.1436,
    phone: "+353 56 777 3000",
    email: "golf@mountjuliet.ie",
    website: "https://www.mountjuliet.ie",
    holes: 18, par: 72,
  },
  {
    name: "Lahinch Golf Club",
    slug: "lahinch",
    description: "The St Andrews of Ireland — a world-class links on the wild Clare coast, established 1892.",
    address: "Lahinch, Co. Clare",
    county: "Clare",
    lat: 52.9336, lng: -9.3443,
    phone: "+353 65 708 1003",
    email: "info@lahinchgolf.com",
    website: "https://www.lahinchgolf.com",
    holes: 18, par: 72,
  },
  {
    name: "Ballybunion Golf Club",
    slug: "ballybunion",
    description: "Ranked among the top courses in the world. Two epic links courses on the wild Kerry coast.",
    address: "Ballybunion, Co. Kerry",
    county: "Kerry",
    lat: 52.5106, lng: -9.6731,
    phone: "+353 68 27146",
    email: "office@ballybuniongolfclub.ie",
    website: "https://www.ballybuniongolfclub.ie",
    holes: 18, par: 71,
  },
  {
    name: "Old Head Golf Links",
    slug: "old-head",
    description: "Perched on a dramatic 220-acre headland peninsula south of Cork — one of the world's most spectacular golf settings.",
    address: "Kinsale, Co. Cork",
    county: "Cork",
    lat: 51.5779, lng: -8.5337,
    phone: "+353 21 477 8444",
    email: "links@oldhead.com",
    website: "https://www.oldhead.com",
    holes: 18, par: 72,
  },
  {
    name: "Adare Manor",
    slug: "adare-manor",
    description: "Host of the 2027 Ryder Cup. A stunning parkland course redesigned by Tom Fazio within a fairytale estate.",
    address: "Adare, Co. Limerick",
    county: "Limerick",
    lat: 52.5626, lng: -8.7954,
    phone: "+353 61 605 200",
    email: "golf@adaremanor.com",
    website: "https://www.adaremanor.com",
    holes: 18, par: 72,
  },
  {
    name: "Powerscourt Golf Club",
    slug: "powerscourt",
    description: "Two magnificent parkland courses set within the breathtaking Powerscourt Estate in the Wicklow mountains.",
    address: "Enniskerry, Co. Wicklow",
    county: "Wicklow",
    lat: 53.1870, lng: -6.1819,
    phone: "+353 1 204 6033",
    email: "golf@powerscourt.ie",
    website: "https://www.powerscourt.com",
    holes: 18, par: 72,
  },
  {
    name: "Carton House Golf Club",
    slug: "carton-house",
    description: "Two championship parkland courses — the O'Meara and the Montgomery — set in a stunning Kildare estate.",
    address: "Maynooth, Co. Kildare",
    county: "Kildare",
    lat: 53.3800, lng: -6.5669,
    phone: "+353 1 505 2000",
    email: "golf@cartonhouse.com",
    website: "https://www.cartonhouse.com",
    holes: 18, par: 72,
  },
  {
    name: "Rosses Point (County Sligo)",
    slug: "county-sligo",
    description: "A magnificent links course at Rosses Point with views of Ben Bulben — Connacht's premier links.",
    address: "Rosses Point, Co. Sligo",
    county: "Sligo",
    lat: 54.3109, lng: -8.5668,
    phone: "+353 71 917 7134",
    email: "office@countysligogolfclub.ie",
    website: "https://www.countysligogolfclub.ie",
    holes: 18, par: 71,
  },
];

async function generateSlotsForClub(clubId: string, scheduleId: string, pricePerPlayer: number) {
  const from = startOfDay(new Date());
  const to = addDays(from, 30);
  let cursor = from;

  while (cursor <= to) {
    const dayOfWeek = cursor.getDay();
    // Skip Monday (pro shop rest day for some clubs)
    if (dayOfWeek !== 1) {
      const [startH, startM] = [7, 30];
      const [endH, endM] = [16, 30];

      let slotTime = new Date(cursor);
      slotTime.setHours(startH, startM, 0, 0);
      const endTime = new Date(cursor);
      endTime.setHours(endH, endM, 0, 0);

      while (slotTime < endTime) {
        await prisma.teeTime.upsert({
          where: { clubId_dateTime: { clubId, dateTime: new Date(slotTime) } },
          create: {
            clubId,
            scheduleId,
            dateTime: new Date(slotTime),
            maxPlayers: 4,
            pricePerPlayer,
            isAvailable: true,
          },
          update: {},
        }).catch(() => {});
        slotTime = addMinutes(slotTime, 10);
      }
    }
    cursor = addDays(cursor, 1);
  }
}

async function main() {
  console.log("🌱 Seeding database…");

  // Create clubs with schedules and tee times
  const priceMap: Record<string, { weekday: number; weekend: number }> = {
    "the-k-club": { weekday: 150, weekend: 200 },
    "portmarnock": { weekday: 130, weekend: 160 },
    "royal-dublin": { weekday: 90, weekend: 110 },
    "druids-glen": { weekday: 85, weekend: 110 },
    "mount-juliet": { weekday: 95, weekend: 125 },
    "lahinch": { weekday: 100, weekend: 130 },
    "ballybunion": { weekday: 90, weekend: 120 },
    "old-head": { weekday: 250, weekend: 275 },
    "adare-manor": { weekday: 200, weekend: 250 },
    "powerscourt": { weekday: 70, weekend: 90 },
    "carton-house": { weekday: 65, weekend: 85 },
    "county-sligo": { weekday: 75, weekend: 95 },
  };

  for (const club of clubs) {
    const prices = priceMap[club.slug] ?? { weekday: 60, weekend: 80 };

    const created = await prisma.golfClub.upsert({
      where: { slug: club.slug },
      create: club,
      update: {},
    });

    // Create a weekday and weekend schedule
    const weekdaySchedule = await prisma.teeTimeSchedule.create({
      data: {
        clubId: created.id,
        name: "Visitor Rate – Weekday",
        daysOfWeek: JSON.stringify([1, 2, 3, 4, 5]),
        startTime: "07:30",
        endTime: "16:30",
        intervalMins: 10,
        maxPlayers: 4,
        pricePerPlayer: prices.weekday,
        validFrom: new Date(),
      },
    });

    const weekendSchedule = await prisma.teeTimeSchedule.create({
      data: {
        clubId: created.id,
        name: "Visitor Rate – Weekend",
        daysOfWeek: JSON.stringify([0, 6]),
        startTime: "07:30",
        endTime: "14:00",
        intervalMins: 10,
        maxPlayers: 4,
        pricePerPlayer: prices.weekend,
        validFrom: new Date(),
      },
    });

    // Generate tee times for next 30 days at weekday price (mix)
    await generateSlotsForClub(created.id, weekdaySchedule.id, prices.weekday);

    console.log(`✅ ${club.name}`);
  }

  // Create a test golfer account
  const hash = await bcrypt.hash("password123", 12);
  await prisma.user.upsert({
    where: { email: "golfer@test.com" },
    create: { name: "Test Golfer", email: "golfer@test.com", passwordHash: hash, role: "golfer" },
    update: {},
  });

  // Create a test club admin account (K Club)
  const kClub = await prisma.golfClub.findUnique({ where: { slug: "the-k-club" } });
  if (kClub) {
    const adminHash = await bcrypt.hash("admin123", 12);
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@kclub.ie" },
      create: { name: "K Club Admin", email: "admin@kclub.ie", passwordHash: adminHash, role: "club_admin" },
      update: {},
    });
    await prisma.clubAdmin.upsert({
      where: { userId: adminUser.id },
      create: { userId: adminUser.id, clubId: kClub.id },
      update: {},
    });
  }

  console.log("\n🎉 Seed complete!");
  console.log("Test accounts:");
  console.log("  Golfer: golfer@test.com / password123");
  console.log("  Club Admin: admin@kclub.ie / admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
