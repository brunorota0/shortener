import { BadRequestException, CACHE_MANAGER, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Url } from 'src/models/url.entity';
import { UrlRepository } from 'src/repositories/url.repository';

@Injectable()
export class RedirectService {
  private readonly logger = new Logger('Redirect - Service');

  constructor(
    private readonly urlRepository: UrlRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  public async getLongUrl(code: string): Promise<string> {
    if (!code) throw new BadRequestException('Url code was not provided.');

    // Cache verification
    const cacheUrl = await this.cacheManager.get(code) as string;
    if (cacheUrl) return cacheUrl;

    const { longUrl } = await this.urlRepository.findOne({ where: { code } });

    if (!longUrl) throw new NotFoundException('Url not found.');

    // Set cache
    await this.cacheManager.set(code, longUrl);

    return longUrl;
  }
}