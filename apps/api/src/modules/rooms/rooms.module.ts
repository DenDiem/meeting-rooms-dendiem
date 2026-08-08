import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { AuthModule } from '@modules/auth/auth.module';

import { RoomsController } from './controllers/rooms.controller';
import { ROOM_REPOSITORY } from './interfaces/room-repository.interface';
import { PrismaRoomRepository } from './repositories/prisma-room.repository';
import { RoomsService } from './services/rooms.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [RoomsController],
  providers: [RoomsService, { provide: ROOM_REPOSITORY, useClass: PrismaRoomRepository }],
  exports: [RoomsService],
})
export class RoomsModule {}
