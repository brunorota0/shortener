import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Header,
  Logger,
  Post,
  UseInterceptors
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/helpers/response.interceptor';
import { Url } from 'src/models/url.entity';
import { ShortenUrlService } from './shortenUrl.service';

@Controller('/shorten')
@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
export class ShortenUrlController {
  private readonly logger = new Logger('ShortenUrl - Controller');

  constructor(
    private readonly service: ShortenUrlService,
  ) { }

  @Post()
  public async shortenUrl(@Body() dto: any): Promise<Url> {
    const { longUrl } = dto;

    this.service.validateUrl(longUrl);

    return this.service.createUrl(longUrl);
  }
}
