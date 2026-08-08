import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { SessionGuard } from '@modules/auth/guards/session.guard';
import type { PublicUserResource } from '@modules/auth/resources/public-user.resource';

import type { CreateBookingDto } from '../dto/create-booking.dto';
import type { MyBookingsDto } from '../dto/my-bookings.dto';
import type { WeekScheduleDto } from '../dto/week-schedule.dto';
import { createBookingRequestSchema } from '../requests/create-booking.request';
import { myBookingsRequestSchema } from '../requests/my-bookings.request';
import { weekScheduleRequestSchema } from '../requests/week-schedule.request';
import type { BookingResource } from '../resources/booking.resource';
import type { PaginatedBookingsResource } from '../resources/paginated-bookings.resource';
import { BookingsService } from '../services/bookings.service';

@Controller('bookings')
@UseGuards(SessionGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  public create(
    @Body(new ZodValidationPipe(createBookingRequestSchema)) dto: CreateBookingDto,
    @CurrentUser() user: PublicUserResource,
  ): Promise<BookingResource> {
    return this.bookingsService.create(dto, user.id);
  }

  @Get('schedule')
  public schedule(
    @Query(new ZodValidationPipe(weekScheduleRequestSchema)) query: WeekScheduleDto,
    @CurrentUser() user: PublicUserResource,
  ): Promise<BookingResource[]> {
    return this.bookingsService.weekSchedule(query, user.id);
  }

  @Get('mine')
  public mine(
    @Query(new ZodValidationPipe(myBookingsRequestSchema)) query: MyBookingsDto,
    @CurrentUser() user: PublicUserResource,
  ): Promise<PaginatedBookingsResource> {
    return this.bookingsService.mine(query, user.id);
  }

  @Delete(':bookingId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public cancel(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @CurrentUser() user: PublicUserResource,
  ): Promise<void> {
    return this.bookingsService.cancel(bookingId, user.id);
  }
}
