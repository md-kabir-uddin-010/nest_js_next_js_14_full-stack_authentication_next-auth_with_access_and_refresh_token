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
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sharedService: SharedService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromBody(request);
    if (!token)
      throw new BadRequestException(RESPONSE_MESSAGE.JWT_BEARER_TOKEN_REQUIRED);

    try {
      await this.sharedService.accessTokenVerify(token);
      return true;
    } catch (error) {
      throw error;
    }
  }

  private extractTokenFromBody(request: Request): string {
    const [type, token] = request?.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
