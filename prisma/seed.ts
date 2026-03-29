import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:dev.db" });
const prisma = new PrismaClient({ adapter });

const BELT_RANKS = [
  "WHITE",
  "YELLOW",
  "GREEN",
  "BLUE",
  "RED",
  "BLACK_1DAN",
  "BLACK_2DAN",
  "BLACK_3DAN",
];

async function main() {
  // Clean existing data
  await prisma.attendance.deleteMany();
  await prisma.beltPromotion.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.parentStudent.deleteMany();
  await prisma.member.deleteMany();
  await prisma.user.deleteMany();
  await prisma.studio.deleteMany();

  // Create demo studio
  const studio = await prisma.studio.create({
    data: {
      name: "Elite Taekwondo Academy",
      address: "123 Main Street",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "US",
      phone: "(213) 555-0100",
      email: "info@elitetkd.com",
      timezone: "America/Los_Angeles",
    },
  });

  // Create studio owner
  await prisma.user.create({
    data: {
      email: "owner@elitetkd.com",
      name: "Master Kim",
      role: "STUDIO_OWNER",
      studioId: studio.id,
    },
  });

  // Create members
  const membersData = [
    { firstName: "Alex", lastName: "Johnson", beltRank: "BLUE", age: 12 },
    { firstName: "Sarah", lastName: "Williams", beltRank: "GREEN", age: 10 },
    { firstName: "Michael", lastName: "Brown", beltRank: "RED", age: 14 },
    { firstName: "Emily", lastName: "Davis", beltRank: "YELLOW", age: 8 },
    { firstName: "James", lastName: "Wilson", beltRank: "BLACK_1DAN", age: 16 },
    { firstName: "Sophia", lastName: "Martinez", beltRank: "WHITE", age: 7 },
    { firstName: "Daniel", lastName: "Anderson", beltRank: "BLUE", age: 11 },
    { firstName: "Olivia", lastName: "Taylor", beltRank: "GREEN", age: 9 },
    { firstName: "Ethan", lastName: "Thomas", beltRank: "RED", age: 15 },
    { firstName: "Ava", lastName: "Garcia", beltRank: "YELLOW", age: 10 },
    { firstName: "Ryan", lastName: "Lee", beltRank: "BLACK_2DAN", age: 18 },
    { firstName: "Mia", lastName: "Clark", beltRank: "WHITE", age: 6 },
  ];

  const members = [];
  for (const m of membersData) {
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - m.age);
    const enrolled = new Date();
    enrolled.setMonth(enrolled.getMonth() - Math.floor(Math.random() * 24));

    const member = await prisma.member.create({
      data: {
        studioId: studio.id,
        firstName: m.firstName,
        lastName: m.lastName,
        dateOfBirth: dob,
        email: `${m.firstName.toLowerCase()}@example.com`,
        phone: `(213) 555-${String(Math.floor(1000 + Math.random() * 9000))}`,
        beltRank: m.beltRank,
        enrollmentDate: enrolled,
        emergencyContactName: `Parent of ${m.firstName}`,
        emergencyContactPhone: `(213) 555-${String(Math.floor(1000 + Math.random() * 9000))}`,
      },
    });
    members.push(member);
  }

  // Create attendance records for past 7 days
  const today = new Date();
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    date.setHours(0, 0, 0, 0);

    // Random subset of members attended each day
    const attendees = members.filter(() => Math.random() > 0.3);
    for (const member of attendees) {
      const checkIn = new Date(date);
      checkIn.setHours(16 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
      const checkOut = new Date(checkIn);
      checkOut.setHours(checkIn.getHours() + 1, Math.floor(Math.random() * 30));

      await prisma.attendance.create({
        data: {
          memberId: member.id,
          studioId: studio.id,
          date,
          checkInTime: checkIn,
          checkOutTime: checkOut,
          status: Math.random() > 0.1 ? "PRESENT" : "LATE",
        },
      });
    }
  }

  // Create belt promotions
  for (const member of members) {
    const currentRankIdx = BELT_RANKS.indexOf(member.beltRank);
    if (currentRankIdx > 0) {
      const prevDate = new Date();
      prevDate.setMonth(prevDate.getMonth() - 6);
      await prisma.beltPromotion.create({
        data: {
          memberId: member.id,
          studioId: studio.id,
          fromBelt: BELT_RANKS[currentRankIdx - 1],
          toBelt: member.beltRank,
          testDate: prevDate,
          passed: true,
          notes: "Excellent form and technique",
        },
      });
    }
  }

  // Create payments
  for (const member of members) {
    // Current month - paid
    await prisma.payment.create({
      data: {
        memberId: member.id,
        studioId: studio.id,
        amount: 150,
        description: "Monthly tuition - March 2026",
        status: Math.random() > 0.3 ? "PAID" : "UNPAID",
        dueDate: new Date("2026-03-01"),
        paidDate: Math.random() > 0.3 ? new Date("2026-03-05") : null,
      },
    });

    // Next month - unpaid
    const dueDate = new Date("2026-04-01");
    await prisma.payment.create({
      data: {
        memberId: member.id,
        studioId: studio.id,
        amount: 150,
        description: "Monthly tuition - April 2026",
        status: "UNPAID",
        dueDate,
      },
    });
  }

  console.log(`Seeded: 1 studio, 1 owner, ${members.length} members, attendance, promotions, payments`);
  console.log(`Studio ID: ${studio.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
