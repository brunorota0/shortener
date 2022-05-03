import { CACHE_MANAGER, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { url } from 'inspector';
import { Url } from 'src/models/url.entity';
import { UrlRepository } from 'src/repositories/url.repository';

@Injectable()
export class RedirectService {
  private readonly logger = new Logger('Redirect - Service');

  constructor(
    private readonly urlRepository: UrlRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jwtService: JwtService
  ) { }

  public async getUrl(code: string): Promise<Url> {
    // Cache verification
    const cacheUrl = await this.cacheManager.get(code) as Url;
    if (cacheUrl) return cacheUrl;

    const url = await this.urlRepository.findOne({ where: { code } });

    if (!url) throw new NotFoundException('Url not found.');

    // Set cache
    await this.cacheManager.set(code, url, { ttl: 10 });

    return url;
  }

  public verifyUrlToken(token: string) {
    try {
      this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token expired');
    }
  }
}