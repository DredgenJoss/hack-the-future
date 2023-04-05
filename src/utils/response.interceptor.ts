import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): any {
    return next.handle().pipe(
      map((_data) => {
        return this.getData(context, _data);
      }),
      catchError((error): any => {
        return throwError(error);
      }),
    );
  }

  getData(context, _data) {
    if (!_data) {
      return;
    }
    let newResponse = null;
    const req = context.switchToHttp().getRequest();
    const { statusCode, originalUrl, method, params, query, body } = req;
    const newStatus = statusCode == null ? 200 : statusCode;
    if (Object.keys(_data).includes('data') || Object.keys(_data).includes('components')) {
      newResponse = {
        code: newStatus,
        message: 'success'
      };
      newResponse = Object.assign({...newResponse, ..._data})
    } else if (Object.keys(_data).includes('formiogrid')) {
      newResponse = _data['formiogrid'];
    } else {
      newResponse = {
        code: newStatus,
        message: 'success',
        data: _data,
      };
    }
    return newResponse;
  }
  
}
