import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { PrismaService } from '@database/prisma.service';
import type { IntervalDto } from '@modules/bookings/dto/interval.dto';
import type { BookingResource } from '@modules/bookings/resources/booking.resource';
import type { BookingsService } from '@modules/bookings/services/bookings.service';

import {
  AFTER_CLOSING_SLOT,
  BEFORE_OPENING_SLOT,
  CONTESTED_SLOT,
  FIXTURE_BOOKING_TITLE,
  FIXTURE_OWNER,
  FIXTURE_ROOM,
  FIXTURE_STRANGER,
  FREE_SLOT,
  MISALIGNED_SLOT,
  MISSING_BOOKING_ID,
  MISSING_ROOM_ID,
  NEW_BOOKING_SLOT,
  PAST_SLOT,
  RECLAIMED_SLOT,
  STRANGERS_SLOT,
  TOO_LONG_SLOT,
  TOO_SHORT_SLOT,
  TWICE_CANCELED_SLOT,
} from './support/booking-fixtures.constants';
import {
  connectTestDatabase,
  createBookingsService,
  removeFixtures,
} from './support/test-database';

let prisma: PrismaService;
let bookings: BookingsService;
let roomId: string;
let ownerId: string;
let strangerId: string;

const book = (
  { start, end }: IntervalDto,
  userId: string = ownerId,
  room: string = roomId,
): Promise<BookingResource> =>
  bookings.create(
    { roomId: room, title: FIXTURE_BOOKING_TITLE, startsAt: start, endsAt: end },
    userId,
  );

beforeAll(async () => {
  prisma = connectTestDatabase();
  bookings = createBookingsService(prisma);

  await removeFixtures(prisma);

  const room = await prisma.room.create({ data: FIXTURE_ROOM });
  const owner = await prisma.user.create({ data: FIXTURE_OWNER });
  const stranger = await prisma.user.create({ data: FIXTURE_STRANGER });

  roomId = room.id;
  ownerId = owner.id;
  strangerId = stranger.id;
});

afterAll(async () => {
  await removeFixtures(prisma);
  await prisma.$disconnect();
});

describe('creating a booking', () => {
  it('stores it and hands it back as mine', async () => {
    const booking = await book(NEW_BOOKING_SLOT);

    expect(booking.isMine).toBe(true);
    expect(booking.room.id).toBe(roomId);
    expect(booking.user.id).toBe(ownerId);
    expect(booking.startsAt).toBe(NEW_BOOKING_SLOT.start.toISOString());
    expect(booking.endsAt).toBe(NEW_BOOKING_SLOT.end.toISOString());

    const stored = await prisma.booking.findUnique({ where: { id: booking.id } });

    expect(stored?.title).toBe(FIXTURE_BOOKING_TITLE);
    expect(stored?.canceledAt).toBeNull();
  });

  it('refuses a room nobody has heard of', async () => {
    await expect(book(FREE_SLOT, ownerId, MISSING_ROOM_ID)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('refuses hours another person already took', async () => {
    await book(CONTESTED_SLOT);

    await expect(book(CONTESTED_SLOT, strangerId)).rejects.toBeInstanceOf(ConflictException);
  });
});

describe('cancelling a booking', () => {
  it('marks it as canceled and gives the hours back', async () => {
    const booking = await book(RECLAIMED_SLOT);

    await bookings.cancel(booking.id, ownerId);

    const stored = await prisma.booking.findUnique({ where: { id: booking.id } });

    expect(stored?.canceledAt).toBeInstanceOf(Date);
    await expect(book(RECLAIMED_SLOT)).resolves.toBeDefined();
  });

  it('refuses to cancel a booking of somebody else', async () => {
    const booking = await book(STRANGERS_SLOT);

    await expect(bookings.cancel(booking.id, strangerId)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('refuses to cancel the same booking twice', async () => {
    const booking = await book(TWICE_CANCELED_SLOT);

    await bookings.cancel(booking.id, ownerId);

    await expect(bookings.cancel(booking.id, ownerId)).rejects.toBeInstanceOf(ConflictException);
  });

  it('refuses to cancel a booking that does not exist', async () => {
    await expect(bookings.cancel(MISSING_BOOKING_ID, ownerId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

describe('refusing hours the office rules forbid', () => {
  it('refuses a booking that already started', async () => {
    await expect(book(PAST_SLOT)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('refuses a booking shorter than half an hour', async () => {
    await expect(book(TOO_SHORT_SLOT)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('refuses a booking longer than four hours', async () => {
    await expect(book(TOO_LONG_SLOT)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('refuses a booking that misses the half hour marks', async () => {
    await expect(book(MISALIGNED_SLOT)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('refuses a booking before the office opens', async () => {
    await expect(book(BEFORE_OPENING_SLOT)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('refuses a booking that runs past closing time', async () => {
    await expect(book(AFTER_CLOSING_SLOT)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('writes none of the refused hours to the database', async () => {
    const stored = await prisma.booking.count({
      where: { roomId, startsAt: { gte: BEFORE_OPENING_SLOT.start, lt: AFTER_CLOSING_SLOT.end } },
    });

    expect(stored).toBe(0);
  });
});
