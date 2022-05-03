import { CacheModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ScheduleModule } from '@nestjs/schedule';
import { dbConfig } from './config/database';
import { ShortenUrlModule } from './modules/shortenUrl/shortenUrl.module';
import { RequestLoggerMiddleware } from './middlewares/requestLogger.middleware';
import { UnhandledErrorDataRepository } from './repositories/error.repository';
import { RedirectModule } from './modules/redirect/redirect.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { throttlerConfig, throttlerProvider } from './config/throttler';

dotenv.config();

@Module({
  imports: [
    CacheModule.register(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(dbConfig),
    TypeOrmModule.forFeature([
      UnhandledErrorDataRepository,
    ]),
    ThrottlerModule.forRoot(throttlerConfig),
    ShortenUrlModule,
    RedirectModule
  ],
  controllers: [],
  providers: [
    throttlerProvider,
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes('*');
  }
}
