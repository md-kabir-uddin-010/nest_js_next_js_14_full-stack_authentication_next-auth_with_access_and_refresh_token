import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class ExceptionService {
  // Not Acceptable Exception
  sendNotAcceptableException(message: string): never {
    throw new NotAcceptableException(message);
  }

  // Not Found Exception
  sendNotFoundException(message: string): never {
    throw new NotFoundException(message);
  }

  // Conflict Exception
  sendConflictException(message: string): never {
    throw new ConflictException(message);
  }

  // Unauthorized Exception
  sendUnauthorizedException(message: string): never {
    throw new UnauthorizedException(message);
  }

  // Bad Request Exception
  sendBadRequestException(message: string): never {
    throw new BadRequestException(message);
  }

  // Internal Server Error Exception
  sendInternalServerErrorException(message: string): never {
    throw new InternalServerErrorException(message);
  }

  // Forbidden Exception
  sendForbiddenException(message: string): never {
    throw new ForbiddenException(message);
  }

  // Unprocessable Entity Exception
  sendUnprocessableEntityException(message: string): never {
    throw new UnprocessableEntityException(message);
  }

  // Custom Exception
  sendCustomException(statusCode: number, message: string): never {
    throw new HttpException(message, statusCode);
  }
}
