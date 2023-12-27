import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { RESPONSE_MESSAGE } from 'utils/enums';
import { ObjectType } from 'utils/types';
import { ExceptionService } from './exception.service';

export interface JWTPayload {
  id: string;
  name: string;
  email: string;
  image: string;
}

@Injectable()
export class SharedService {
  constructor(
    private readonly exceptionService: ExceptionService,
    private readonly ConfigService: ConfigService,
  ) {}

  // Genared JWT Access Token
  generateAccessToken(payload: ObjectType): string {
    try {
      const token = jwt.sign(
        payload,
        this.ConfigService.get('access_token_secret'),
        {
          expiresIn: this.ConfigService.get('access_token_expiresIn'),
          issuer: this.ConfigService.get('token_issuer'),
        },
      );

      return token;
    } catch (error) {
      throw error;
    }
  }

  // Genared JWT Access Token
  generateRefreshToken(payload: ObjectType): string {
    try {
      const token = jwt.sign(
        payload,
        this.ConfigService.get('refresh_token_secret'),
        {
          expiresIn: this.ConfigService.get('refresh_token_expiresIn'),
          issuer: this.ConfigService.get('token_issuer'),
        },
      );

      return token;
    } catch (error) {
      throw error;
    }
  }
  // Genared JWT Email Varification Token
  generateVarificationToken(payload: ObjectType): string {
    try {
      const token = jwt.sign(
        payload,
        this.ConfigService.get('email_varification_token_secret'),
        {
          expiresIn: this.ConfigService.get(
            'email_varification_token_expiresIn',
          ),
          issuer: this.ConfigService.get('token_issuer'),
        },
      );

      return token;
    } catch (error) {
      throw error;
    }
  }

  // verify access token
  accessTokenVerify(token: string): any {
    try {
      const verify = jwt.verify(
        token,
        this.ConfigService.get('access_token_secret'),
      );
      return verify;
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        this.exceptionService.sendUnauthorizedException(
          RESPONSE_MESSAGE.JWT_TOKEN_EXPIRED,
        );
      }
      this.exceptionService.sendUnauthorizedException(
        RESPONSE_MESSAGE.INVALID_JWT_TOKEN,
      );
    }
  }

  // verify access token
  refreshTokenVerify(token: string): any {
    try {
      const verify = jwt.verify(
        token,
        this.ConfigService.get('refresh_token_secret'),
      );
      return verify;
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        this.exceptionService.sendUnauthorizedException(
          RESPONSE_MESSAGE.JWT_TOKEN_EXPIRED,
        );
      }
      this.exceptionService.sendUnauthorizedException(
        RESPONSE_MESSAGE.INVALID_JWT_TOKEN,
      );
    }
  }

  // verify access token
  decodeVarificatonToken(token: string): any {
    try {
      return jwt.verify(
        token,
        this.ConfigService.get('email_varification_token_secret'),
      );
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        this.exceptionService.sendUnauthorizedException(
          RESPONSE_MESSAGE.JWT_TOKEN_EXPIRED,
        );
      }
      this.exceptionService.sendUnauthorizedException(
        RESPONSE_MESSAGE.INVALID_JWT_TOKEN,
      );
    }
  }

  // decode google oauth login token
  decodeOAuthLoginToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(
        token,
        this.ConfigService.get('OAUTH_JWT_SECRET'),
      );
      const { id, name, email, image } = decoded as JWTPayload;

      return { id, name, email, image };
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        this.exceptionService.sendUnauthorizedException(
          RESPONSE_MESSAGE.JWT_TOKEN_EXPIRED,
        );
      }
      this.exceptionService.sendUnauthorizedException(
        RESPONSE_MESSAGE.INVALID_JWT_TOKEN,
      );
    }
  }
}
