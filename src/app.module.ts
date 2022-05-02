import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ScheduleModule } from '@nestjs/schedule';
import { dbConfig } from './config/database';
import { ShortenUrlModule } from './modules/shortenUrl/shortenUrl.module';
import { RequestLoggerMiddleware } from './middlewares/requestLogger.middleware';
import { UnhandledErrorDataRepository } from './repositories/error.repository';
import { RedirectModule } from './modules/redirect/redirect.module';

dotenv.config();

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(dbConfig),
    TypeOrmModule.forFeature([
      UnhandledErrorDataRepository,
    ]),
    ShortenUrlModule,
    RedirectModule
  ],
  controllers: [],
  providers: [],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes('*');
  }
}
