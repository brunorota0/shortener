import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";

export const throttlerProvider = {
  provide: APP_GUARD,
  useClass: ThrottlerGuard,
}

export const throttlerConfig = {
  ttl: 60, // Time to live (in seconds)
  limit: 10, // Limit of request before return a 429 status code
}