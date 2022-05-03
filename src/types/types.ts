export interface Response<T> {
  status: boolean;

  message?: string;

  data: T;
}

export interface ShortenUrlDto {
  longUrl: string
  expiresIn?: string // 1s, 1h, 1d
  customCode?: string
}