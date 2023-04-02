import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { isArray } from 'class-validator/types/decorator/typechecker/IsArray';
import { HttpStatusCode } from './http-status-code.enum';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    console.error(exception);
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseError =
      exception instanceof HttpException
        ? exception.getResponse()
        : { error: '', message: '' };

    this.logger.error(
      `Status: ${status} Error: ${JSON.stringify(responseError)}`,
    );
    response.status(status).json({
      code: status,
      error: responseError['error'] || HttpStatusCode[status.toString()],
      message: this.getError(responseError['message']),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  getError(message) {
    if (Array.isArray(message)) {
      return message.join(', ');
    } else {
      return message;
    }
  }
}
