import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Url } from 'src/models/url.entity';
import { UrlRepository } from 'src/repositories/url.repository';
import validUrl from 'valid-url';
import shortid from 'shortid';

const { BASE_URL } = process.env;

@Injectable()
export class ShortenUrlService {
  private readonly logger = new Logger('ShortenUrl - Service');

  constructor(
    private readonly urlRepository: UrlRepository
  ) { }

  public async shortenUrl(): Promise<void> {
  }

  public validateUrl(longUrl: string): void {
    if (!validUrl.isUri(longUrl)) throw new BadRequestException('Invalid URL provided');
  }

  public async createUrl(longUrl: string): Promise<Url> {
    let url: Url = await this.urlRepository.findOne({ where: { longUrl } });

    if (url) return url;

    const code = shortid.generate();

    const shortUrl = `${BASE_URL}/${code}`;

    url = this.urlRepository.create({
      code,
      longUrl,
      shortUrl,
      domain: new URL(longUrl).hostname
    });

    return url.save();
  }
}