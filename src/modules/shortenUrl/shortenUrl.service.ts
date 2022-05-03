import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { Url } from 'src/models/url.entity';
import { UrlRepository } from 'src/repositories/url.repository';
import validUrl from 'valid-url';
import shortid from 'shortid';
import { JwtService } from '@nestjs/jwt';
import { ShortenUrlDto } from 'src/types/types';
import { SharedService } from '../shared/shared.service';

const { BASE_URL, DEFAULT_TOKEN_EXPIRATION } = process.env;

@Injectable()
export class ShortenUrlService {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly jwtService: JwtService,
    private readonly sharedService: SharedService
  ) { }

  public isValidUri(longUrl: string): void {
    if (!validUrl.isUri(longUrl)) throw new BadRequestException('Invalid URL provided');
  }

  public async createUrl(dto: ShortenUrlDto): Promise<Url> {
    const { longUrl, expiresIn, customCode } = dto;

    const code = await this.generateCode(customCode);

    const shortUrl = `${BASE_URL}/${code}`;

    const tokenExpiration = expiresIn ?? DEFAULT_TOKEN_EXPIRATION;
    const token = this.jwtService.sign({ code }, { expiresIn: tokenExpiration });

    const url = this.urlRepository.create({
      code,
      longUrl,
      shortUrl,
      token,
    });

    return url.save();
  }

  private async generateCode(customCode?: string): Promise<string> {
    let code;

    if (customCode) {
      await this.validateUrlExistence(customCode);

      code = customCode;
    } else {
      code = shortid.generate();
    }

    return code;
  }

  private async validateUrlExistence(customCode: string): Promise<void> {
    const urlFound = await this.urlRepository.findOne({ where: { code: customCode } })
    if (!urlFound) return;

    const isValidToken = this.sharedService.isValidToken(urlFound);
    if (isValidToken) {
      throw new HttpException('Custom code already exists', 400);
    } else {
      if (urlFound.id) await this.urlRepository.remove(urlFound);
    }
  }

}