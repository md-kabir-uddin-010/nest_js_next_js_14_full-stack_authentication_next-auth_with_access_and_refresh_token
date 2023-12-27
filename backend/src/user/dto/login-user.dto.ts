import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { TrimWhiteSpace } from 'utils/decorators';

export class LoginUserDto {
  @TrimWhiteSpace()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @TrimWhiteSpace()
  @IsStrongPassword()
  @Length(3, 30)
  @IsString()
  @IsNotEmpty()
  password: string;
}
