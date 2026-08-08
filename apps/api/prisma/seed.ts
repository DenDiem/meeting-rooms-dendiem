import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';
import { config } from 'dotenv';
import { DateTime } from 'luxon';

import { PrismaClient } from '../src/generated/prisma/client';

config({ path: '../../.env', quiet: true });

const SALT_ROUNDS = 10;

const ROOMS = [
  { name: 'Aquarium', floor: 1, capacity: 6 },
  { name: 'Workshop', floor: 1, capacity: 20 },
  { name: 'Mars', floor: 2, capacity: 4 },
  { name: 'Apollo', floor: 2, capacity: 10 },
  { name: 'Lighthouse', floor: 3, capacity: 8 },
  { name: 'Observatory', floor: 3, capacity: 14 },
];

const USERS = [
  { name: 'Ivan Petrenko', email: 'ivan@example.com', password: 'password123' },
  { name: 'Olena Kovalenko', email: 'olena@example.com', password: 'password123' },
];

const DEMO_BOOKINGS = [
  {
    room: 'Aquarium',
    user: 'ivan@example.com',
    title: 'Sprint planning',
    day: 0,
    from: 10,
    to: 11,
  },
  { room: 'Aquarium', user: 'olena@example.com', title: 'Design sync', day: 0, from: 11, to: 12 },
  { room: 'Mars', user: 'olena@example.com', title: 'One-on-one', day: 1, from: 9.5, to: 10.5 },
  { room: 'Apollo', user: 'ivan@example.com', title: 'Quarterly review', day: 2, from: 14, to: 18 },
  { room: 'Observatory', user: 'olena@example.com', title: 'Standup', day: 3, from: 12, to: 12.5 },
];

const officeZone = process.env['OFFICE_TIMEZONE'] ?? 'Europe/Kyiv';
const nextMonday = DateTime.now().setZone(officeZone).startOf('week').plus({ weeks: 1 });

const officeTime = (dayOffset: number, hour: number): Date =>
  nextMonday
    .plus({ days: dayOffset })
    .set({ hour: Math.floor(hour), minute: (hour % 1) * 60, second: 0, millisecond: 0 })
    .toJSDate();

const seed = async (prisma: PrismaClient): Promise<void> => {
  const rooms = new Map<string, string>();

  for (const room of ROOMS) {
    const { id } = await prisma.room.upsert({
      where: { name: room.name },
      update: { floor: room.floor, capacity: room.capacity },
      create: room,
    });

    rooms.set(room.name, id);
  }

  const users = new Map<string, string>();

  for (const user of USERS) {
    const passwordHash = await hash(user.password, SALT_ROUNDS);
    const { id } = await prisma.user.upsert({
      where: { emailNormalized: user.email },
      update: { name: user.name, passwordHash },
      create: {
        name: user.name,
        email: user.email,
        emailNormalized: user.email,
        passwordHash,
      },
    });

    users.set(user.email, id);
  }

  await prisma.booking.deleteMany();

  for (const booking of DEMO_BOOKINGS) {
    const roomId = rooms.get(booking.room);
    const userId = users.get(booking.user);

    if (!roomId || !userId) {
      throw new Error(`Seed data refers to a missing room or user: ${booking.title}`);
    }

    await prisma.booking.create({
      data: {
        roomId,
        userId,
        title: booking.title,
        startsAt: officeTime(booking.day, booking.from),
        endsAt: officeTime(booking.day, booking.to),
      },
    });
  }

  console.log(
    `Seeded ${ROOMS.length} rooms, ${USERS.length} users and ${DEMO_BOOKINGS.length} bookings.`,
  );
  console.log(`Demo week starts on ${nextMonday.toISODate()} (${officeZone}).`);
};

const connectionString = process.env['DATABASE_URL'];

if (!connectionString) {
  throw new Error('DATABASE_URL is not set.');
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

seed(prisma)
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
