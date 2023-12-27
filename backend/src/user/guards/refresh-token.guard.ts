import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RESPONSE_MESSAGE } from 'utils/enums';
import { SharedService } from './../../shared/shared.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sharedService: SharedService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromBody(request);
    if (!token)
      throw new BadRequestException(RESPONSE_MESSAGE.JWT_TOKEN_REQUIRED);

    try {
      const payload = await this.sharedService.refreshTokenVerify(token);
      request['user'] = payload;
      return true;
    } catch (error) {
      throw error;
    }
  }

  private extractTokenFromBody(request: Request): string {
    const { token } = request.body;
    return token;
  }
}
