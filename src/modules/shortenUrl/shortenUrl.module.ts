import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlRepository } from 'src/repositories/url.repository';
import { SharedService } from '../shared/shared.service';
import { ShortenUrlController } from './shortenUrl.controller';
import { ShortenUrlService } from './shortenUrl.service';

@Module({
  imports: [
    JwtModule.register({secret: 'jwtsecret'}),
    TypeOrmModule.forFeature([
      UrlRepository
    ]),
  ],
  controllers: [
    ShortenUrlController,
  ],
  providers: [
    ShortenUrlService,
    SharedService
  ]
})
export class ShortenUrlModule {}
