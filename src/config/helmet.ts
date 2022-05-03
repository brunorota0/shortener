import { HelmetOptions } from "helmet";

export const helmetConfig: HelmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [`'self'`],
      styleSrc: [
        `'self'`,
        `'unsafe-inline'`,
        'cdn.jsdelivr.net',
        'fonts.googleapis.com',
      ],
      fontSrc: [`'self'`, 'fonts.gstatic.com'],
      imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
      scriptSrc: [`'self'`, `https: 'unsafe-inline'`, `cdn.jsdelivr.net`],
    }
  }
}