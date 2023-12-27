import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { USER_MODEL, UserDocument } from 'src/models/user';
import { ACCOUNT_STATUS, SIGNUP_STRATEGY } from 'utils/enums';
import { GoogleStrategySendUserData } from 'utils/types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
    ConfigService: ConfigService,
  ) {
    super({
      clientID: ConfigService.get('client_id'),
      clientSecret: ConfigService.get('client_secret'),
      callbackURL: ConfigService.get('client_redirect_url'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { id, provider, displayName, name, emails, photos } = profile;

      const user: GoogleStrategySendUserData = {
        id,
        provider,
        displayName,
        name,
        email: emails[0].value,
        picture: photos[0].value,
        verified: emails[0].verified,
      };

      const findUserOnDbB = await this.userModel.findOne({ email: user.email });
      if (findUserOnDbB) {
        return done(null, findUserOnDbB);
      }

      const saveUser = await this.userModel.create({
        name: user.displayName,
        email: user.email,
        password: user.id,
        profile_pic: user.picture,
        account_status: ACCOUNT_STATUS.ACTIVE,
        signup_strategy: SIGNUP_STRATEGY.GOOGLE,
        email_verified: true,
      });
      done(null, saveUser);
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Mongoose validation error
        const errors = Object.values(error.errors).map((err) => err);
        throw new BadRequestException(errors);
      }
      throw new InternalServerErrorException();
    }
  }
}
