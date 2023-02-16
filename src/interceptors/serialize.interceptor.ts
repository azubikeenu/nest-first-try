import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
  Injectable,
} from '@nestjs/common';

import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import { plainToInstance } from 'class-transformer';

// makes sure that the Dto comforms to an instance type
interface ClassContrustor {
  new (...args: any[]): {};
}

//class decorator
export function Serialize(dto: ClassContrustor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {

  }
  intercept(
    _: ExecutionContext,  // this is a wrapper around the incoming request
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) =>
        plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        }),
      ),
    );
  }
}
