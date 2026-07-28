import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

const DEFAULT_PORT = 3000;

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  await app.listen(Number(configService.get('API_PORT') ?? DEFAULT_PORT));
};

void bootstrap();
