import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlRepository } from 'src/repositories/url.repository';
import { ShortenUrlController } from './shortenUrl.controller';
import { ShortenUrlService } from './shortenUrl.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UrlRepository
    ]),
  ],
  controllers: [
    ShortenUrlController,
  ],
  providers: [
    ShortenUrlService
  ]
})
export class ShortenUrlModule {}
