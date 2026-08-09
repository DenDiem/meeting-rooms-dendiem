import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import { map, type Observable } from 'rxjs';

import { Paginated } from '../resources/paginated';

@Injectable()
export class ResponseEnvelopeInterceptor implements NestInterceptor {
  public intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((payload: unknown) => {
        if (payload === undefined) {
          return payload;
        }

        if (payload instanceof Paginated) {
          return {
            data: payload.items,
            meta: { total: payload.total, page: payload.page, perPage: payload.perPage },
          };
        }

        return { data: payload };
      }),
    );
  }
}
