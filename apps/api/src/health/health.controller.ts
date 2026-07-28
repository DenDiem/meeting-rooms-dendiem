import { Controller, Get } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

interface HealthResponse {
  readonly status: 'ok';
  readonly database: 'up' | 'down';
}

@Controller('health')
export class HealthController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  public async check(): Promise<HealthResponse> {
    const isDatabaseReachable = await this.prismaService.isReachable();

    return { status: 'ok', database: isDatabaseReachable ? 'up' : 'down' };
  }
}
