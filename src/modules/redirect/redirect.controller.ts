import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Param,
  Res,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseInterceptor } from 'src/helpers/response.interceptor';
import { RedirectService } from './redirect.service';

@Controller('')
@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
export class RedirectController {
  private readonly logger = new Logger('Redirect - Controller');

  constructor(
    private readonly service: RedirectService,
  ) { }

  @Get('/:code')
  public async redirect(@Res() res: Response, @Param() params): Promise<any> {
    const { code } = params;
    
    if (!code.trim()) throw new BadRequestException('Url code was not provided.');

    const { longUrl, token } = await this.service.getUrl(code);

    this.service.verifyUrlToken(token);

    res.redirect(longUrl);
    //return longUrl;
  }
}
