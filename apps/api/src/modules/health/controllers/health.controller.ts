import { Controller, Get } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';

import type { HealthResource } from '../resources/health.resource';

@Controller('health')
export class HealthController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  public async check(): Promise<HealthResource> {
    const isDatabaseReachable = await this.prismaService.isReachable();

    return { status: 'ok', database: isDatabaseReachable ? 'up' : 'down' };
  }
}
