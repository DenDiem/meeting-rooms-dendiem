import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';
import { config } from 'dotenv';
import { DateTime } from 'luxon';

import { DEFAULT_OFFICE_TIMEZONE } from '@config/config.constants';
import { PrismaClient } from '@generated/prisma/client';

import { SALT_ROUNDS, SEED_BOOKINGS, SEED_ROOMS, SEED_USERS } from './seed.constants';

config({ path: '../../.env', quiet: true });

const officeZone = process.env['OFFICE_TIMEZONE'] ?? DEFAULT_OFFICE_TIMEZONE;
const nextMonday = DateTime.now().setZone(officeZone).startOf('week').plus({ weeks: 1 });

const officeTime = (dayOffset: number, hour: number): Date =>
  nextMonday
    .plus({ days: dayOffset })
    .set({ hour: Math.floor(hour), minute: (hour % 1) * 60, second: 0, millisecond: 0 })
    .toJSDate();

const seed = async (prisma: PrismaClient): Promise<void> => {
  const rooms = new Map<string, string>();

  for (const room of SEED_ROOMS) {
    const { id } = await prisma.room.upsert({
      where: { name: room.name },
      update: { floor: room.floor, capacity: room.capacity },
      create: room,
    });

    rooms.set(room.name, id);
  }

  const users = new Map<string, string>();

  for (const user of SEED_USERS) {
    const passwordHash = await hash(user.password, SALT_ROUNDS);
    const { id } = await prisma.user.upsert({
      where: { emailNormalized: user.email },
      update: {
        name: user.name,
        email: user.email,
        passwordHash,
        emailConfirmedAt: new Date(),
      },
      create: {
        name: user.name,
        email: user.email,
        emailNormalized: user.email,
        passwordHash,
        emailConfirmedAt: new Date(),
      },
    });

    users.set(user.email, id);
  }

  await prisma.booking.deleteMany();

  for (const booking of SEED_BOOKINGS) {
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
    `Seeded ${SEED_ROOMS.length} rooms, ${SEED_USERS.length} users and ${SEED_BOOKINGS.length} bookings.`,
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
