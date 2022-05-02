import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Type,
  Logger
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { plainToClassFromExist } from 'class-transformer';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Response } from '../types/types';

@Injectable()
export class ResponseInterceptor<T>
implements NestInterceptor<T, Response<T>> {
  private readonly logger = new Logger('RES');

  constructor(
    private readonly reflector: Reflector
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const res = context.switchToHttp().getResponse();
    const Type = this.reflector.get<any>('Type', context.getHandler());
    return next
      .handle()
      .pipe(
        map((data) => ({
          status: true,
          message: 'Ok',
          data: Type ? plainToClassFromExist(Type, data) : data
        })),
        tap((payload) => {
          this.logger.debug(`${res.txid} << ${res.statusCode}`);
          this.logger.debug(`${JSON.stringify(payload.data, null, 2)}`);
        })
      );
  }
}
