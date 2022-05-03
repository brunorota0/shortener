import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/helpers/response.interceptor';
import { Url } from 'src/models/url.entity';
import { ShortenUrlDto } from 'src/types/types';
import { ShortenUrlService } from './shortenUrl.service';

@Controller('/shorten')
@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
export class ShortenUrlController {
  constructor(
    private readonly service: ShortenUrlService,
  ) { }

  @Post()
  public async shortenUrl(@Body() dto: ShortenUrlDto): Promise<Url> {
    const { longUrl } = dto;

    this.service.isValidUri(longUrl);

    return this.service.createUrl(dto);
  }
}
