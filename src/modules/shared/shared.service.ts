import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Url } from 'src/models/url.entity';
import { UrlRepository } from 'src/repositories/url.repository';

@Injectable()
export class SharedService {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly jwtService: JwtService
  ) { }

  public async isValidToken(url: Url): Promise<boolean> {
    const { token } = url;
    try {
      this.jwtService.verify(token);
      return true;
    } catch (error) {
      if (url.id) await this.urlRepository.remove(url);
      return false;
    }
  }
}