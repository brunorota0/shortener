import { CacheModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ScheduleModule } from '@nestjs/schedule';
import { dbConfig } from './config/database';
import { ShortenUrlModule } from './modules/shortenUrl/shortenUrl.module';
import { RequestLoggerMiddleware } from './middlewares/requestLogger.middleware';
import { UnhandledErrorDataRepository } from './repositories/error.repository';
import { RedirectModule } from './modules/redirect/redirect.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { throttlerConfig } from './config/throttler';

dotenv.config();

@Module({
  imports: [
    CacheModule.register(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(dbConfig),
    TypeOrmModule.forFeature([
      UnhandledErrorDataRepository,
    ]),
    ThrottlerModule.forRoot({
      ttl: 60, // Time to live (in seconds)
      limit: 10, // Limit of request before return a 429 status code
    }),
    ShortenUrlModule,
    RedirectModule
  ],
  controllers: [],
  providers: [
    throttlerConfig,
    
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes('*');
  }
}
