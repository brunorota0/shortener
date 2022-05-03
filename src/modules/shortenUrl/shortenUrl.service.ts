import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Url } from 'src/models/url.entity';
import { UrlRepository } from 'src/repositories/url.repository';
import validUrl from 'valid-url';
import shortid from 'shortid';
import { JwtService } from '@nestjs/jwt';
import { ShortenUrlDto } from 'src/types/types';

const { BASE_URL, DEFAULT_TOKEN_EXPIRATION } = process.env;

@Injectable()
export class ShortenUrlService {
  private readonly logger = new Logger('ShortenUrl - Service');

  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly jwtService: JwtService,
  ) { }

  public validateUrl(longUrl: string): void {
    if (!validUrl.isUri(longUrl)) throw new BadRequestException('Invalid URL provided');
  }

  public async createUrl(dto: ShortenUrlDto): Promise<Url> {
    const { longUrl, expiresIn } = dto;

    const code = shortid.generate();
    const shortUrl = `${BASE_URL}/${code}`;
    
    const tokenExpiration = expiresIn ?? DEFAULT_TOKEN_EXPIRATION;
    const token = this.jwtService.sign({ code }, {expiresIn: tokenExpiration });

    const url = this.urlRepository.create({
      code,
      longUrl,
      shortUrl,
      token,
    });

    return url.save();
  }
}