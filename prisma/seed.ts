import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import { addDays, startOfDay, addMinutes } from "date-fns";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const clubs = [
  { name: "The K Club", slug: "the-k-club", description: "Home of the 2006 Ryder Cup. Two championship courses set in 550 acres of stunning Kildare parkland.", address: "Straffan, Co. Kildare", county: "Kildare", lat: 53.3047, lng: -6.6361, phone: "+353 1 601 7300", email: "golf@kclub.ie", website: "https://www.kclub.ie", holes: 18, par: 72 },
  { name: "Portmarnock Golf Club", slug: "portmarnock", description: "One of the world's greatest links courses, set on a peninsula north of Dublin.", address: "Portmarnock, Co. Dublin", county: "Dublin", lat: 53.4225, lng: -6.1402, phone: "+353 1 846 2968", email: "office@portmarnockgolfclub.ie", website: "https://www.portmarnockgolfclub.ie", holes: 18, par: 72 },
  { name: "Royal Dublin Golf Club", slug: "royal-dublin", description: "A classic links on Bull Island in Dublin Bay, established in 1885.", address: "Bull Island, Dollymount, Dublin 3", county: "Dublin", lat: 53.3695, lng: -6.1740, phone: "+353 1 833 6346", email: "info@theroyaldublingolfclub.com", website: "https://www.theroyaldublingolfclub.com", holes: 18, par: 73 },
  { name: "Druids Glen Golf Resort", slug: "druids-glen", description: "The Augusta of Europe — four-time host of the Irish Open, set in the Wicklow countryside.", address: "Newtownmountkennedy, Co. Wicklow", county: "Wicklow", lat: 53.0983, lng: -6.1174, phone: "+353 1 287 3600", email: "golf@druidsglen.ie", website: "https://www.druidsglenresort.com", holes: 18, par: 71 },
  { name: "Mount Juliet Estate", slug: "mount-juliet", description: "Jack Nicklaus-designed championship course set within a 1,500-acre estate in Co. Kilkenny.", address: "Thomastown, Co. Kilkenny", county: "Kilkenny", lat: 52.5223, lng: -7.1436, phone: "+353 56 777 3000", email: "golf@mountjuliet.ie", website: "https://www.mountjuliet.ie", holes: 18, par: 72 },
  { name: "Lahinch Golf Club", slug: "lahinch", description: "The St Andrews of Ireland — a world-class links on the wild Clare coast, established 1892.", address: "Lahinch, Co. Clare", county: "Clare", lat: 52.9336, lng: -9.3443, phone: "+353 65 708 1003", email: "info@lahinchgolf.com", website: "https://www.lahinchgolf.com", holes: 18, par: 72 },
  { name: "Ballybunion Golf Club", slug: "ballybunion", description: "Ranked among the top courses in the world. Two epic links courses on the wild Kerry coast.", address: "Ballybunion, Co. Kerry", county: "Kerry", lat: 52.5106, lng: -9.6731, phone: "+353 68 27146", email: "office@ballybuniongolfclub.ie", website: "https://www.ballybuniongolfclub.ie", holes: 18, par: 71 },
  { name: "Old Head Golf Links", slug: "old-head", description: "Perched on a dramatic 220-acre headland — one of the world's most spectacular settings.", address: "Kinsale, Co. Cork", county: "Cork", lat: 51.5779, lng: -8.5337, phone: "+353 21 477 8444", email: "links@oldhead.com", website: "https://www.oldhead.com", holes: 18, par: 72 },
  { name: "Adare Manor", slug: "adare-manor", description: "Host of the 2027 Ryder Cup. A stunning parkland course redesigned by Tom Fazio.", address: "Adare, Co. Limerick", county: "Limerick", lat: 52.5626, lng: -8.7954, phone: "+353 61 605 200", email: "golf@adaremanor.com", website: "https://www.adaremanor.com", holes: 18, par: 72 },
  { name: "Powerscourt Golf Club", slug: "powerscourt", description: "Two stunning parkland courses in the foothills of the Wicklow Mountains.", address: "Enniskerry, Co. Wicklow", county: "Wicklow", lat: 53.1838, lng: -6.1975, phone: "+353 1 204 6033", email: "golf@powerscourt.ie", website: "https://www.powerscourt.com", holes: 18, par: 72 },
  { name: "Carton House Golf Club", slug: "carton-house", description: "Two championship courses on a historic estate in the heart of Kildare.", address: "Maynooth, Co. Kildare", county: "Kildare", lat: 53.3805, lng: -6.5843, phone: "+353 1 505 2000", email: "golf@cartonhouse.com", website: "https://www.cartonhouse.com", holes: 18, par: 72 },
  { name: "County Sligo Golf Club", slug: "county-sligo", description: "One of Ireland's great links courses, ranked in the world's top 100, with views of Benbulben.", address: "Rosses Point, Co. Sligo", county: "Sligo", lat: 54.3145, lng: -8.5691, phone: "+353 71 917 7186", email: "info@countysligogolfclub.ie", website: "https://www.countysligogolfclub.ie", holes: 18, par: 71 },
  { name: "Killarney Golf & Fishing Club", slug: "killarney", description: "Three stunning courses on the shores of Lough Leane in the heart of Kerry.", address: "Mahony's Point, Killarney, Co. Kerry", county: "Kerry", lat: 52.0449, lng: -9.5369, phone: "+353 64 663 1034", email: "reservations@killarney-golf.com", website: "https://www.killarney-golf.com", holes: 18, par: 72 },
  { name: "Waterville Golf Links", slug: "waterville", description: "A remote masterpiece on the Ring of Kerry — one of Ireland's most celebrated links.", address: "Waterville, Co. Kerry", county: "Kerry", lat: 51.8316, lng: -10.1614, phone: "+353 66 947 4102", email: "wvgolf@iol.ie", website: "https://www.watervillegolflinks.ie", holes: 18, par: 72 },
  { name: "Doonbeg Golf Club", slug: "doonbeg", description: "A world-class links on the wild Atlantic Way, now part of the Trump International portfolio.", address: "Doonbeg, Co. Clare", county: "Clare", lat: 52.7202, lng: -9.5260, phone: "+353 65 905 5246", email: "golf@trumpgolfdoonbeg.com", website: "https://www.trumpgolfdoonbeg.com", holes: 18, par: 72 },
  { name: "Royal Portrush Golf Club", slug: "royal-portrush", description: "Host of The Open Championship. The jewel of Northern Ireland's Causeway Coast.", address: "Portush, Co. Antrim", county: "Antrim", lat: 55.2038, lng: -6.6580, phone: "+44 28 7082 2311", email: "info@royalportrushgolfclub.com", website: "https://www.royalportrushgolfclub.com", holes: 18, par: 72 },
  { name: "Portstewart Golf Club", slug: "portstewart", description: "Three links courses on the Causeway Coast of Northern Ireland.", address: "Portstewart, Co. Derry", county: "Derry", lat: 55.1843, lng: -6.7228, phone: "+44 28 7083 2015", email: "secretary@portstewartgc.co.uk", website: "https://www.portstewartgc.co.uk", holes: 18, par: 72 },
  { name: "Enniscrone Golf Club", slug: "enniscrone", description: "A spectacular links on Killala Bay in Co. Sligo — one of Ireland's hidden gems.", address: "Enniscrone, Co. Sligo", county: "Sligo", lat: 54.0516, lng: -9.1018, phone: "+353 96 36297", email: "info@enniscronegolf.com", website: "https://www.enniscronegolf.com", holes: 18, par: 73 },
  { name: "Connemara Golf Club", slug: "connemara", description: "A wild and dramatic links at the edge of the Atlantic in the heart of Connemara.", address: "Ballyconneely, Co. Galway", county: "Galway", lat: 53.4136, lng: -10.0505, phone: "+353 95 23502", email: "links@connemaralinks.com", website: "https://www.connemaralinks.com", holes: 18, par: 72 },
  { name: "Tralee Golf Club", slug: "tralee", description: "Designed by Arnold Palmer on a spectacular cliff-top setting on the Barrow Peninsula.", address: "West Barrow, Ardfert, Co. Kerry", county: "Kerry", lat: 52.3108, lng: -9.8699, phone: "+353 66 713 6379", email: "info@traleegolfclub.com", website: "https://www.traleegolfclub.com", holes: 18, par: 71 },
  { name: "Galway Bay Golf Resort", slug: "galway-bay", description: "A beautiful parkland course with stunning views over Galway Bay.", address: "Renville, Oranmore, Co. Galway", county: "Galway", lat: 53.2625, lng: -8.9343, phone: "+353 91 790500", email: "golf@galwaybaygolfresort.com", website: "https://www.galwaybaygolfresort.com", holes: 18, par: 72 },
];

const priceMap: Record<string, { weekday: number; weekend: number }> = {
  "the-k-club":      { weekday: 150, weekend: 200 },
  "portmarnock":     { weekday: 130, weekend: 160 },
  "royal-dublin":    { weekday: 90,  weekend: 110 },
  "druids-glen":     { weekday: 85,  weekend: 110 },
  "mount-juliet":    { weekday: 95,  weekend: 125 },
  "lahinch":         { weekday: 100, weekend: 130 },
  "ballybunion":     { weekday: 90,  weekend: 120 },
  "old-head":        { weekday: 250, weekend: 275 },
  "adare-manor":     { weekday: 200, weekend: 250 },
  "powerscourt":     { weekday: 70,  weekend: 90  },
  "carton-house":    { weekday: 65,  weekend: 85  },
  "county-sligo":    { weekday: 75,  weekend: 95  },
  "killarney":       { weekday: 80,  weekend: 105 },
  "waterville":      { weekday: 95,  weekend: 120 },
  "doonbeg":         { weekday: 180, weekend: 220 },
  "royal-portrush":  { weekday: 160, weekend: 190 },
  "portstewart":     { weekday: 85,  weekend: 110 },
  "enniscrone":      { weekday: 55,  weekend: 70  },
  "connemara":       { weekday: 60,  weekend: 80  },
  "tralee":          { weekday: 110, weekend: 140 },
  "galway-bay":      { weekday: 50,  weekend: 65  },
};

// Simple seeded random to keep demo consistent
function seededRand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

async function generateSlotsForClub(clubId: string, scheduleId: string, pricePerPlayer: number, clubIndex: number) {
  const from = startOfDay(new Date());
  const to   = addDays(from, 60);
  let cursor = from;
  let slotIndex = 0;

  while (cursor <= to) {
    const dow = cursor.getDay();
    if (dow !== 1) { // skip Monday
      let slotTime = new Date(cursor);
      slotTime.setHours(7, 30, 0, 0);
      const endTime = new Date(cursor);
      endTime.setHours(16, 30, 0, 0);

      while (slotTime < endTime) {
        // Deterministic "already booked" logic for demo realism
        const rand = seededRand(clubIndex * 1000 + slotIndex);
        // ~12% fully booked, ~18% 1 spot left, rest available
        const bookedCount =
          rand < 0.12 ? 4 :
          rand < 0.30 ? 3 :
          0;

        await prisma.teeTime.upsert({
          where:  { clubId_dateTime: { clubId, dateTime: new Date(slotTime) } },
          create: { clubId, scheduleId, dateTime: new Date(slotTime), maxPlayers: 4, pricePerPlayer, isAvailable: true, bookedCount },
          update: { bookedCount },
        }).catch(() => {});

        slotTime = addMinutes(slotTime, 10);
        slotIndex++;
      }
    }
    cursor = addDays(cursor, 1);
  }
}

async function main() {
  console.log("Seeding database...");

  for (let idx = 0; idx < clubs.length; idx++) {
    const club   = clubs[idx];
    const prices = priceMap[club.slug] ?? { weekday: 60, weekend: 80 };

    const created = await prisma.golfClub.upsert({
      where:  { slug: club.slug },
      create: { ...club, isActive: true },
      update: { isActive: true },
    });

    // Create or reuse a schedule (delete old ones to avoid duplicates)
    await prisma.teeTimeSchedule.deleteMany({ where: { clubId: created.id } });

    const schedule = await prisma.teeTimeSchedule.create({
      data: {
        clubId:         created.id,
        name:           "Visitor Rate",
        daysOfWeek:     JSON.stringify([0, 2, 3, 4, 5, 6]),
        startTime:      "07:30",
        endTime:        "16:30",
        intervalMins:   10,
        maxPlayers:     4,
        pricePerPlayer: prices.weekday,
        validFrom:      new Date(),
      },
    });

    // Delete future tee times and regenerate so dates stay fresh
    const today = startOfDay(new Date());
    await prisma.teeTime.deleteMany({
      where: { clubId: created.id, dateTime: { gte: today } },
    });

    await generateSlotsForClub(created.id, schedule.id, prices.weekday, idx);
    console.log(`  ${club.name}`);
  }

  // Test accounts
  const hash = await bcrypt.hash("password123", 12);
  await prisma.user.upsert({
    where:  { email: "golfer@test.com" },
    create: { name: "Test Golfer", email: "golfer@test.com", passwordHash: hash, role: "golfer" },
    update: {},
  });

  const kClub = await prisma.golfClub.findUnique({ where: { slug: "the-k-club" } });
  if (kClub) {
    const adminHash = await bcrypt.hash("admin123", 12);
    const adminUser = await prisma.user.upsert({
      where:  { email: "admin@kclub.ie" },
      create: { name: "K Club Admin", email: "admin@kclub.ie", passwordHash: adminHash, role: "club_admin" },
      update: {},
    });
    await prisma.clubAdmin.upsert({
      where:  { userId: adminUser.id },
      create: { userId: adminUser.id, clubId: kClub.id },
      update: {},
    });
  }

  console.log("\nSeed complete.");
  console.log("  Golfer:     golfer@test.com / password123");
  console.log("  Club Admin: admin@kclub.ie  / admin123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
