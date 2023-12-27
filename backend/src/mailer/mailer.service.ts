import { MailerService as Mailer_Service } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerService {
  constructor(private mailer_Service: Mailer_Service) {}

  async sendVerificationEmail(
    email: string,
    email_verification_link: string,
  ): Promise<boolean> {
    try {
      const transport = {
        to: email,
        from: process.env.SENDER_EMAIL,
        subject: 'Account Verification',
        html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>Account Verification</title>
          </head>
          <body>
            <div style="background-color: #f2f2f2; padding: 20px">
              <div
                style="
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 40px;
                  border-radius: 5px;
                "
              >
                <h2 style="text-align: center; color: #333333">Account Verification</h2>
                <p style="color: #666666">Dear User</p>
                <p style="color: #666666">
                  Welcome to our community! Before you embark on this exciting journey,
                  we kindly ask you to verify your email address to activate your
                  account.
                </p>
                <p style="text-align: center; margin-top: 30px">
                  <a
                    href="${email_verification_link}"
                    style="
                      display: inline-block;
                      background-color: #4caf50;
                      color: #ffffff;
                      text-decoration: none;
                      padding: 10px 20px;
                      border-radius: 5px;
                    "
                    >Verify Email</a
                  >
                </p>
                <p style="color: #666666">
                  We look forward to seeing you make the most of our platform!
                </p>
                <p style="color: #666666">Best regards,<br />Md. Kabir Uddin</p>
              </div>
            </div>
          </body>
        </html>
        `,
      };
      await this.mailer_Service.sendMail(transport);
      return true;
    } catch (error) {
      return false;
    }
  }

  async sendForgotPasswordEmail(
    email: string,
    emailVerificationLink: string,
  ): Promise<boolean> {
    try {
      const transport = {
        to: email,
        from: process.env.SENDER_EMAIL,
        subject: 'Forgot Password Request',
        html: `
            <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <title>Forgot Password Request</title>
                    </head>
                    <body>
                        <div style="background-color: #f2f2f2; padding: 20px;">
                            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 5px;">
                                <h2 style="text-align: center; color: #333333;">Forgot Password Request</h2>
                                <p style="color: #666666;">Dear User</p>
                                <p style="color: #666666;">We received a forgot password request for your account, to reset your password please click the below button.</p>
                                <p style="text-align: center; margin-top: 30px;">
                                    <a href="${emailVerificationLink}" style="display: inline-block; background-color: #4CAF50; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Reset Password</a>
                                </p>
                                <p style="color: #666666;">Thank you for choosing FULLET. We look forward to seeing you make the most of our platform!</p>
                                <p style="color: #666666;">Best regards,<br>FULLET</p>
                            </div>
                        </div>
                    </body>
                    </html>`,
      };
      await this.mailer_Service.sendMail(transport);
      return true;
    } catch (error) {
      console.error(error.message, error, this.sendForgotPasswordEmail.name);
      return false;
    }
  }
}
