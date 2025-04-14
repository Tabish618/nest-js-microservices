import {
    Catch,
    ArgumentsHost,
    ExceptionFilter,
    HttpStatus,
  } from '@nestjs/common';
  import { RpcException } from '@nestjs/microservices';
  import { Response } from 'express';
  
  @Catch(RpcException)
  export class RpcToHttpExceptionFilter implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      const error = exception.getError();
  
      // Handle structured error object
      if (typeof error === 'object' && error !== null) {
        const statusCode = error['statusCode'] || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error['message'] || 'Internal server error';
  
        return response.status(statusCode).json({
          statusCode,
          message,
        });
      }
  
      // Handle plain string error
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: String(error),
      });
    }
  }
  