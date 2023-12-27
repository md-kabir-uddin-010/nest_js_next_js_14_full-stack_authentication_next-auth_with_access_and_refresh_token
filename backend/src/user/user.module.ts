import { Module } from '@nestjs/common';
import { MailerModule } from 'src/mailer/mailer.module';
import { GoogleStrategy } from './strategies/GoogleStrategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MailerModule],
  controllers: [UserController],
  providers: [UserService, GoogleStrategy],
  exports: [UserService],
})
export class UserModule {}
