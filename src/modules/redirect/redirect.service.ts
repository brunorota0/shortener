import { CACHE_MANAGER, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Url } from 'src/models/url.entity';
import { UrlRepository } from 'src/repositories/url.repository';

@Injectable()
export class RedirectService {
  constructor(
    private readonly urlRepository: UrlRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
}