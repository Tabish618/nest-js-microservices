import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    BadRequestException,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  @Catch(BadRequestException)
  export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
  
      let errors = {};
  
      // Default NestJS validation error structure
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse['message'] &&
        Array.isArray(exceptionResponse['message'])
      ) {
        const messages = exceptionResponse['message'] as string[];
  
        errors = messages.reduce((acc, message) => {
          const [field, ...rest] = message.split(' ');
          const cleanMessage = rest.join(' ');
          acc[field] = cleanMessage;
          return acc;
        }, {});
      }
  
      response.status(status).json({
        statusCode: status,
        message: 'Validation error',
        errors,
      });
    }
  }
  