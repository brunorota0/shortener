import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Param,
  Res,
  UnauthorizedException,
  UseInterceptors
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseInterceptor } from 'src/helpers/response.interceptor';
import { SharedService } from '../shared/shared.service';
import { RedirectService } from './redirect.service';

@Controller('')
@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
export class RedirectController {
  private readonly logger = new Logger('Redirect - Controller');

  constructor(
    private readonly service: RedirectService,
    private readonly sharedService: SharedService
  ) { }

  @Get('/:code')
  public async redirect(@Res() res: Response, @Param() params): Promise<any> {
    const { code } = params;

    if (!code.trim()) throw new BadRequestException('Url code was not provided.');

    const url = await this.service.getUrl(code);

    const isValidToken = await this.sharedService.isValidToken(url);
    if (!isValidToken) throw new UnauthorizedException('Token expired');

    res.redirect(url.longUrl);
    //return longUrl;
  }
}
