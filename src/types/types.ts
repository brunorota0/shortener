export interface Response<T> {
  status: boolean;

  message?: string;

  data: T;
}

export interface ShortenUrlDto {
  longUrl: string
  expiresIn?: string
  customCode?: string
}