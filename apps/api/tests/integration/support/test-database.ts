import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

import { PrismaService } from '@database/prisma.service';
import { PrismaBookingRepository } from '@modules/bookings/repositories/prisma-booking.repository';

export const TEST_FIXTURE_PREFIX = 'integration-test-';

export const connectTestDatabase = (): PrismaService => {
  config({ path: '../../.env', quiet: true });

  const connectionString = process.env['DATABASE_URL'];

  if (connectionString === undefined) {
    throw new Error('DATABASE_URL is not set. Integration tests need a database.');
  }

  return new PrismaService(new ConfigService({ DATABASE_URL: connectionString }));
};

export const createBookingRepository = (prisma: PrismaService): PrismaBookingRepository =>
  new PrismaBookingRepository(prisma);

export const removeFixtures = async (prisma: PrismaService): Promise<void> => {
  await prisma.booking.deleteMany({ where: { title: { startsWith: TEST_FIXTURE_PREFIX } } });
  await prisma.room.deleteMany({ where: { name: { startsWith: TEST_FIXTURE_PREFIX } } });
  await prisma.user.deleteMany({ where: { email: { startsWith: TEST_FIXTURE_PREFIX } } });
};
