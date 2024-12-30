import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { TVShowServiceBaseException } from './tvshow.service.base.exception';
import { DatabaseException } from 'src/exceptions/database.exception';

@Catch()
export class TVShowServiceExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    if(exception instanceof TVShowServiceBaseException || exception instanceof DatabaseException  ){
        response.status(512).json({
            statusCode: 512,
            timestamp: new Date().toISOString(),
            path: request.url,
            errorCode: exception.applicationErrorCode,
            message: exception.message,
        }

        )
    }   


    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}