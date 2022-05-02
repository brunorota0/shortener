import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlRepository } from 'src/repositories/url.repository';
import { RedirectController } from './redirect.controller';
import { RedirectService } from './redirect.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UrlRepository
    ]),
  ],
  controllers: [
    RedirectController,
  ],
  providers: [
    RedirectService
  ]
})

export class RedirectModule {}
