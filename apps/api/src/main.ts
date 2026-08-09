import 'reflect-metadata';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { ApiExceptionFilter } from '@common/exception-filters/api-exception.filter';
import { ResponseEnvelopeInterceptor } from '@common/interceptors/response-envelope.interceptor';
import { DEFAULT_API_PORT } from '@config/config.constants';

import { AppModule } from './app.module';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalInterceptors(new ResponseEnvelopeInterceptor());
  app.useGlobalFilters(new ApiExceptionFilter());

  await app.listen(Number(configService.get('API_PORT') ?? DEFAULT_API_PORT));
};

void bootstrap();
