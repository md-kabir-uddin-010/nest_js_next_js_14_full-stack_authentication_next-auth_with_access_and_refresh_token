import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { MailerService } from 'src/mailer/mailer.service';
import { REFRESH_TOKEN_MODEL, TokenDocument } from 'src/models/token';
import {
  VERIFICATION_TOKEN_MODEL,
  VerificationTokenDocument,
} from 'src/models/token/verification-token.schema';
import { USER_MODEL, UserDocument } from 'src/models/user';
import { ExceptionService } from 'src/shared/exception.service';
import { SharedService } from 'src/shared/shared.service';
import { ACCOUNT_STATUS, RESPONSE_MESSAGE, SIGNUP_STRATEGY } from 'utils/enums';
import {
  GoogleStrategySendUserData,
  JWTVerifyPayload,
  JwtPayload,
} from 'utils/types';
import { AccountVarificationDto, JWTTokenDto, LoginUserDto } from './dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GoogleLoginDto } from './dto/google-login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
    @InjectModel(VERIFICATION_TOKEN_MODEL)
    private readonly verificationTokenModel: Model<VerificationTokenDocument>,
    @InjectModel(REFRESH_TOKEN_MODEL)
    private readonly tokenModel: Model<TokenDocument>,
    private readonly exceptionService: ExceptionService,
    private readonly sharedService: SharedService,
    private readonly mailerService: MailerService,
    private readonly ConfigService: ConfigService,
  ) {}

  // signup user
  async addNewUser(body: CreateUserDto) {
    try {
      const { name, email, password } = body;

      // find user already exist or not
      const findUser = await this.userModel.findOne({ email });
      if (findUser) {
        return this.exceptionService.sendConflictException(
          RESPONSE_MESSAGE.USER_ALREADY_EXIST,
        );
      }

      // save user on database
      const createUser = await this.userModel.create({ name, email, password });

      const payload: JwtPayload = {
        id: createUser._id,
        email: createUser.email,
        isEmailVerification: true,
      };

      const userInfo = {
        id: createUser._id,
        name: createUser.name,
        email: createUser.email,
        profile_pic: createUser.profile_pic,
        account_status: createUser.account_status,
        signup_strategy: createUser.signup_strategy,
        user_role: createUser.user_role,
        email_verified: createUser.email_verified,
      };

      // generate account varification token
      const varificationToken =
        this.sharedService.generateVarificationToken(payload);

      const verificationPage = this.ConfigService.get(
        'user_email_varification_page',
      );
      const varificationLink = `${verificationPage}?token=${varificationToken}`;

      // save user varification token on database
      const saveVarificationToken = await this.verificationTokenModel.create({
        user_id: createUser._id,
        token: varificationToken,
      });

      if (!saveVarificationToken) {
        return this.exceptionService.sendInternalServerErrorException(
          RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
        );
      }

      // send varification email
      const sendVarificationEmail =
        await this.mailerService.sendVerificationEmail(
          createUser.email,
          varificationLink,
        );

      if (!sendVarificationEmail) {
        return this.exceptionService.sendInternalServerErrorException(
          RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        statusCode: 201,
        message: RESPONSE_MESSAGE.USER_CREATED_SUCCESSFULL,
        info: userInfo,
      };
    } catch (error) {
      throw error;
    }
  }

  // verify email
  async verifyUserAccount(body: AccountVarificationDto) {
    try {
      const { token } = body;
      const decoded: JwtPayload =
        this.sharedService.decodeVarificatonToken(token);

      if (!decoded?.isEmailVerification) {
        this.exceptionService.sendBadRequestException(
          RESPONSE_MESSAGE.UNAUTHORIZED,
        );
      }

      const findUser = await this.userModel.findById(decoded.id);
      if (findUser?.email_verified === true) {
        this.exceptionService.sendNotAcceptableException(
          RESPONSE_MESSAGE.USER_ALREADY_VERIFYED,
        );
      }

      const findVerificationToken = await this.verificationTokenModel.findOne({
        user_id: decoded.id,
      });
      if (!findVerificationToken) {
        this.exceptionService.sendNotFoundException(
          RESPONSE_MESSAGE.UNAUTHORIZED,
        );
      }

      const matchToken = findVerificationToken.token === token;
      if (!matchToken) {
        this.exceptionService.sendBadRequestException(
          RESPONSE_MESSAGE.UNAUTHORIZED,
        );
      }

      const payload: JwtPayload = {
        id: findUser._id,
        email: findUser.email,
        isEmailVerification: false,
      };

      const accessToken = this.sharedService.generateAccessToken(payload);
      const refreshToken = this.sharedService.generateRefreshToken(payload);

      const findRefreshToken = await this.tokenModel.findOne({
        user_id: findUser._id,
      });

      if (!findRefreshToken) {
        await this.tokenModel.create({
          user_id: findUser._id,
          token: refreshToken,
        });
      } else {
        await this.tokenModel.findOneAndUpdate(
          { user_id: findUser._id },
          { token: refreshToken },
        );
      }

      await this.verificationTokenModel.findByIdAndDelete(
        findVerificationToken._id,
      );

      const updateUser = await this.userModel.findByIdAndUpdate(
        findUser._id,
        { email_verified: true, account_status: ACCOUNT_STATUS.ACTIVE },
        { new: true },
      );

      return { accessToken, refreshToken, info: updateUser };
    } catch (error) {
      throw error;
    }
  }

  // login user
  async loginUser(body: LoginUserDto) {
    try {
      const { email, password } = body;

      const findUser = await this.userModel.findOne({ email }, '+password');
      if (!findUser) {
        return this.exceptionService.sendUnauthorizedException(
          RESPONSE_MESSAGE.INVALID_EMAIL,
        );
      }

      if (findUser.signup_strategy !== SIGNUP_STRATEGY.EMAIL) {
        return this.exceptionService.sendNotAcceptableException(
          RESPONSE_MESSAGE.EMAIL_ALREDY_RESIGTARD_ANOTHER_STRATEGY,
        );
      }

      const isMatchPassword = await findUser.isValidPassword(password);
      if (!isMatchPassword) {
        this.exceptionService.sendUnauthorizedException(
          RESPONSE_MESSAGE.INVALID_PASSWORD,
        );
      }

      // when your is not verifyed
      if (!findUser?.email_verified) {
        const payload: JwtPayload = {
          id: findUser._id,
          email: findUser.email,
          isEmailVerification: true,
        };

        // generate account varification token
        const varificationToken =
          this.sharedService.generateVarificationToken(payload);

        const verificationPage = this.ConfigService.get(
          'user_email_varification_page',
        );
        const varificationLink = `${verificationPage}?token=${varificationToken}`;

        const findVerificationToken = await this.verificationTokenModel.findOne(
          { user_id: findUser._id },
        );

        // save user varification token on database
        if (!findVerificationToken) {
          await this.verificationTokenModel.create({
            user_id: findUser._id,
            token: varificationToken,
          });
        } else {
          await this.verificationTokenModel.findByIdAndUpdate(
            findVerificationToken._id,
            {
              token: varificationToken,
            },
          );
        }

        // send varification email
        const sendVarificationEmail =
          await this.mailerService.sendVerificationEmail(
            findUser.email,
            varificationLink,
          );

        if (!sendVarificationEmail) {
          return this.exceptionService.sendInternalServerErrorException(
            RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
          );
        }
        return {
          statusCode: 200,
          message: RESPONSE_MESSAGE.SEND_VERIFICATION_EMAIL,
          info: findUser,
        };
      }

      const payload: JwtPayload = {
        id: findUser._id,
        email: findUser.email,
      };
      const accessToken = this.sharedService.generateAccessToken(payload);
      const refreshToken = this.sharedService.generateRefreshToken(payload);

      const findRefreshToken = await this.tokenModel.findOne({
        user_id: findUser._id,
      });

      if (!findRefreshToken) {
        await this.tokenModel.create({
          user_id: findUser._id,
          token: refreshToken,
        });
      } else {
        await this.tokenModel.findByIdAndUpdate(findRefreshToken._id, {
          token: refreshToken,
        });
      }

      return { accessToken, refreshToken, info: findUser };
    } catch (error) {
      throw error;
    }
  }

  //OAuth Google Login
  async GoogleLoginOAuth(body: GoogleLoginDto) {
    try {
      const { token } = body;
      const { id, name, email, image } =
        this.sharedService.decodeOAuthLoginToken(token);

      const findUser = await this.userModel.findOne({ email }, '+password');

      // when user not found
      if (!findUser) {
        // save user on database
        const createUser = await this.userModel.create({
          name,
          email,
          password: id,
          signup_strategy: SIGNUP_STRATEGY.GOOGLE,
          email_verified: true,
          account_status: ACCOUNT_STATUS.ACTIVE,
          profile_pic: image,
        });

        const payload: JwtPayload = {
          id: createUser._id,
          email: createUser.email,
        };

        const userInfo = {
          id: createUser._id,
          name: createUser.name,
          email: createUser.email,
          profile_pic: createUser.profile_pic,
          account_status: createUser.account_status,
          signup_strategy: createUser.signup_strategy,
          user_role: createUser.user_role,
          email_verified: createUser.email_verified,
        };

        const accessToken = this.sharedService.generateAccessToken(payload);
        const refreshToken = this.sharedService.generateRefreshToken(payload);

        const findRefreshToken = await this.tokenModel.findOne({
          user_id: createUser._id,
        });

        if (!findRefreshToken) {
          await this.tokenModel.create({
            user_id: createUser._id,
            token: refreshToken,
          });
        } else {
          await this.tokenModel.findByIdAndUpdate(findRefreshToken._id, {
            token: refreshToken,
          });
        }

        return { accessToken, refreshToken, info: userInfo };
      }

      // when user found
      if (findUser && findUser.signup_strategy !== SIGNUP_STRATEGY.GOOGLE) {
        return this.exceptionService.sendNotAcceptableException(
          RESPONSE_MESSAGE.EMAIL_ALREDY_RESIGTARD_ANOTHER_STRATEGY,
        );
      }

      const isMatchPassword = await findUser.isValidPassword(id);
      if (!isMatchPassword) {
        this.exceptionService.sendUnauthorizedException(
          RESPONSE_MESSAGE.INVALID_CREDENTIALS,
        );
      }

      const payload: JwtPayload = {
        id: findUser._id,
        email: findUser.email,
      };
      const accessToken = this.sharedService.generateAccessToken(payload);
      const refreshToken = this.sharedService.generateRefreshToken(payload);

      const findRefreshToken = await this.tokenModel.findOne({
        user_id: findUser._id,
      });

      if (!findRefreshToken) {
        await this.tokenModel.create({
          user_id: findUser._id,
          token: refreshToken,
        });
      } else {
        await this.tokenModel.findByIdAndUpdate(findRefreshToken._id, {
          token: refreshToken,
        });
      }

      return { accessToken, refreshToken, info: findUser };
    } catch (error) {
      throw error;
    }
  }

  // Refresh Token
  async refreshToken(req: Request, body: JWTTokenDto) {
    try {
      const { token } = body;
      const { email } = req.user as JWTVerifyPayload;

      const findUser = await this.userModel.findOne({ email });
      if (!findUser) {
        return this.exceptionService.sendNotFoundException(
          RESPONSE_MESSAGE.USER_NOT_FOUND,
        );
      }

      const findRefreshToken = await this.tokenModel.findOne({
        user_id: findUser._id,
      });

      if (!findRefreshToken) {
        return this.exceptionService.sendUnauthorizedException(
          RESPONSE_MESSAGE.UNAUTHORIZED,
        );
      }

      const matchToken = findRefreshToken.token === token;
      if (!matchToken) {
        return this.exceptionService.sendUnauthorizedException(
          RESPONSE_MESSAGE.TOKEN_IS_BLACKLIST,
        );
      }

      const payload: JwtPayload = {
        id: findUser._id,
        email: findUser.email,
      };
      // genarate token
      const accessToken = this.sharedService.generateAccessToken(payload);
      const refreshToken = this.sharedService.generateRefreshToken(payload);

      // update token
      await this.tokenModel.findByIdAndUpdate(findRefreshToken._id, {
        token: refreshToken,
      });

      return { accessToken, refreshToken, info: findUser };
    } catch (error) {
      throw error;
    }
  }

  //Log Out
  async logoutUser(req: Request, body: JWTTokenDto) {
    try {
      const { token } = body;
      const { email } = req.user as JWTVerifyPayload;

      const findUser = await this.userModel.findOne({ email });
      if (!findUser) {
        return this.exceptionService.sendNotFoundException(
          RESPONSE_MESSAGE.USER_NOT_FOUND,
        );
      }

      const findRefreshToken = await this.tokenModel.findOne({
        user_id: findUser._id,
      });

      if (!findRefreshToken) {
        return this.exceptionService.sendUnauthorizedException(
          RESPONSE_MESSAGE.UNAUTHORIZED,
        );
      }

      const matchToken = findRefreshToken.token === token;
      if (!matchToken) {
        return this.exceptionService.sendUnauthorizedException(
          RESPONSE_MESSAGE.TOKEN_IS_BLACKLIST,
        );
      }

      await this.tokenModel.findByIdAndDelete(findRefreshToken._id);

      return { message: 'logout succefull' };
    } catch (error) {
      throw error;
    }
  }
  // google login
  async googleLogin(req: Request, res: Response) {
    try {
      if (!req.user) {
        throw this.exceptionService.sendBadRequestException(
          'No User find form Google',
        );
      }

      const user: GoogleStrategySendUserData = req.user;

      const findUser = await this.userModel.findOne({ email: user.email });
      if (!findUser) {
        return this.exceptionService.sendUnauthorizedException(
          RESPONSE_MESSAGE.INVALID_EMAIL,
        );
      }

      const payload: JwtPayload = {
        id: findUser._id,
        email: findUser.email,
      };

      const accessToken = this.sharedService.generateAccessToken(payload);
      const refreshToken = this.sharedService.generateRefreshToken(payload);

      const findRefreshToken = await this.tokenModel.findOne({
        user_id: findUser._id,
      });

      if (!findRefreshToken) {
        await this.tokenModel.create({
          user_id: findUser._id,
          token: refreshToken,
        });
      } else {
        await this.tokenModel.findByIdAndUpdate(findRefreshToken._id, {
          token: refreshToken,
        });
      }

      return res.redirect(
        `http://localhost:3000/user/google/login?_act=${accessToken}&_reft=${refreshToken}&_info=${findUser}`,
      );
    } catch (error) {
      throw error;
    }
  }
}
