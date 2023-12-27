import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AccountVarificationDto, JWTTokenDto, LoginUserDto } from './dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { UserService } from './user.service';

@Controller('auth/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    return await this.userService.addNewUser(body);
  }

  @Post('account/verify')
  @HttpCode(200)
  async verifiyAccount(@Body() body: AccountVarificationDto) {
    return await this.userService.verifyUserAccount(body);
  }

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    return await this.userService.loginUser(body);
  }

  // OAuth Google Login
  @Post('oauth/google/login')
  async googleAuthLogin(@Body() body: GoogleLoginDto) {
    return await this.userService.GoogleLoginOAuth(body);
  }

  // Resfresh token
  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshUserToken(@Req() req: Request, @Body() body: JWTTokenDto) {
    return await this.userService.refreshToken(req, body);
  }

  // Resfresh token
  @Post('logout')
  @UseGuards(RefreshTokenGuard)
  async logout(@Req() req: Request, @Body() body: JWTTokenDto) {
    return await this.userService.logoutUser(req, body);
  }

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  googleLogin(@Req() req) {}

  // http://localhost:4000/api/auth/user/google/redirect
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() req: Request, @Res() res: Response) {
    return await this.userService.googleLogin(req, res);
  }

  // get user by id is protected route
  @Get('get')
  @UseGuards(AccessTokenGuard)
  async getUser() {
    return { msg: 'sk kabir islam' };
  }
}
