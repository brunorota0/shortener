import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import compression from 'compression';
import { AppModule } from './app.module';
import { LogUnhandledErrorFilter } from './filters/log.filter';
import { checkEnvironmentVars } from './helpers/env.helper';
import helmet from 'helmet';
import { helmetConfig } from './config/helmet';

dotenv.config();

async function bootstrap() {
  checkEnvironmentVars();

  const app = await NestFactory.create(AppModule, {
    logger: process.env.DEBUG === 'false' ? ['error', 'log'] : undefined
  });

  app.use(compression());
  app.use(helmet(helmetConfig));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new LogUnhandledErrorFilter());

  await app.listen(process.env.PORT);
}

bootstrap();
