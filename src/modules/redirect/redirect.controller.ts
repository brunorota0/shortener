import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Param,
  Res,
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

    const longUrl = await this.service.getLongUrl(code);

    res.redirect(longUrl);
    //return longUrl;
  }
}
