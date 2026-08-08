import 'reflect-metadata';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { DEFAULT_API_PORT } from '@config/config.constants';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  await app.listen(Number(configService.get('API_PORT') ?? DEFAULT_API_PORT));
};

void bootstrap();
