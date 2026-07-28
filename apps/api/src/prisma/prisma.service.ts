import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService) {
    super({
      adapter: new PrismaPg({ connectionString: configService.getOrThrow<string>('DATABASE_URL') }),
    });
  }

  public async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  public async isReachable(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;

      return true;
    } catch (error) {
      this.logger.warn(`Database is unreachable: ${String(error)}`);

      return false;
    }
  }
}
