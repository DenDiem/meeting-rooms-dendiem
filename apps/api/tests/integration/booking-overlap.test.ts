import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { PrismaService } from '@database/prisma.service';
import { SlotTakenException } from '@modules/bookings/exceptions/slot-taken.exception';
import type { PrismaBookingRepository } from '@modules/bookings/repositories/prisma-booking.repository';

import {
  connectTestDatabase,
  createBookingRepository,
  removeFixtures,
  TEST_FIXTURE_PREFIX,
} from './support/test-database';

const utc = (iso: string): Date => new Date(`${iso}:00.000Z`);

const MONDAY_TEN = utc('2027-03-01T10:00');
const MONDAY_ELEVEN = utc('2027-03-01T11:00');
const MONDAY_TWELVE = utc('2027-03-01T12:00');
const TUESDAY_TEN = utc('2027-03-02T10:00');
const TUESDAY_ELEVEN = utc('2027-03-02T11:00');

let prisma: PrismaService;
let bookings: PrismaBookingRepository;
let roomId: string;
let otherRoomId: string;
let userId: string;

const book = (
  startsAt: Date,
  endsAt: Date,
  room: string = roomId,
): ReturnType<PrismaBookingRepository['create']> =>
  bookings.create({
    roomId: room,
    userId,
    title: `${TEST_FIXTURE_PREFIX}booking`,
    startsAt,
    endsAt,
  });

const clashWith = async (startsAt: Date, endsAt: Date): Promise<boolean> =>
  (await bookings.findFirst({ roomId, overlapping: { start: startsAt, end: endsAt } })) !== null;

beforeAll(async () => {
  prisma = connectTestDatabase();
  bookings = createBookingRepository(prisma);

  await removeFixtures(prisma);

  const room = await prisma.room.create({
    data: { name: `${TEST_FIXTURE_PREFIX}room`, floor: 1, capacity: 4 },
  });
  const otherRoom = await prisma.room.create({
    data: { name: `${TEST_FIXTURE_PREFIX}other-room`, floor: 1, capacity: 4 },
  });
  const user = await prisma.user.create({
    data: {
      name: 'Integration Test',
      email: `${TEST_FIXTURE_PREFIX}user@example.com`,
      emailNormalized: `${TEST_FIXTURE_PREFIX}user@example.com`,
      passwordHash: 'not-a-real-hash',
    },
  });

  roomId = room.id;
  otherRoomId = otherRoom.id;
  userId = user.id;

  await book(MONDAY_TEN, MONDAY_ELEVEN);
});

afterAll(async () => {
  await removeFixtures(prisma);
  await prisma.$disconnect();
});

describe('an existing booking from 10:00 to 11:00', () => {
  it('lets the next one start exactly when it ends', async () => {
    await expect(book(MONDAY_ELEVEN, MONDAY_TWELVE)).resolves.toBeDefined();
    expect(await clashWith(MONDAY_ELEVEN, MONDAY_TWELVE)).toBe(true);
  });

  it('refuses a booking that starts in the middle of it', async () => {
    const half = utc('2027-03-01T10:30');

    expect(await clashWith(half, MONDAY_ELEVEN)).toBe(true);
    await expect(book(half, MONDAY_ELEVEN)).rejects.toBeInstanceOf(SlotTakenException);
  });

  it('refuses a booking with exactly the same hours', async () => {
    expect(await clashWith(MONDAY_TEN, MONDAY_ELEVEN)).toBe(true);
    await expect(book(MONDAY_TEN, MONDAY_ELEVEN)).rejects.toBeInstanceOf(SlotTakenException);
  });

  it('refuses a booking that swallows it', async () => {
    const early = utc('2027-03-01T09:00');

    await expect(book(early, MONDAY_TWELVE)).rejects.toBeInstanceOf(SlotTakenException);
  });

  it('allows the same hours on the next day', async () => {
    expect(await clashWith(TUESDAY_TEN, TUESDAY_ELEVEN)).toBe(false);
    await expect(book(TUESDAY_TEN, TUESDAY_ELEVEN)).resolves.toBeDefined();
  });

  it('allows the same hours in another room', async () => {
    await expect(book(MONDAY_TEN, MONDAY_ELEVEN, otherRoomId)).resolves.toBeDefined();
  });

  it('frees the hours once it is cancelled', async () => {
    const afternoon = utc('2027-03-01T15:00');
    const later = utc('2027-03-01T16:00');
    const booking = await book(afternoon, later);

    await bookings.cancel(booking.id, new Date());

    expect(await clashWith(afternoon, later)).toBe(false);
    await expect(book(afternoon, later)).resolves.toBeDefined();
  });
});

describe('when several requests race for one slot', () => {
  it('lets exactly one through', async () => {
    const startsAt = utc('2027-03-03T10:00');
    const endsAt = utc('2027-03-03T11:00');

    const results = await Promise.allSettled(
      Array.from({ length: 5 }, () => book(startsAt, endsAt)),
    );

    const created = results.filter((result) => result.status === 'fulfilled');
    const rejected = results.filter((result) => result.status === 'rejected');

    expect(created).toHaveLength(1);
    expect(rejected).toHaveLength(4);
    expect(
      rejected.every(
        (result) => result.status === 'rejected' && result.reason instanceof SlotTakenException,
      ),
    ).toBe(true);

    const stored = await prisma.booking.count({
      where: { roomId, startsAt, endsAt, canceledAt: null },
    });

    expect(stored).toBe(1);
  });
});
