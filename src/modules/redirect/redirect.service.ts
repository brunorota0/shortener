import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Url } from 'src/models/url.entity';
import { UrlRepository } from 'src/repositories/url.repository';

@Injectable()
export class RedirectService {
  private readonly logger = new Logger('Redirect - Service');

  constructor(
    private readonly urlRepository: UrlRepository
  ) { }

  public async getUrl(code: string): Promise<Url> {
    if (!code) throw new BadRequestException('Url code was not provided.');

    const url = await this.urlRepository.findOne({ where: { code } });

    if (!url) throw new NotFoundException('Url not found.');

    return url;
  }
}