import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseCofingModule } from './config/db/database.config.module';
import { MailerModule as Mailer_Module } from './mailer/mailer.module';
import { MongooseModelsModule } from './models/mongoose-model.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      },
    }),
    Mailer_Module,
    DatabaseCofingModule,
    MongooseModelsModule,
    UserModule,
    SharedModule,
  ],
})
export class AppModule {}
