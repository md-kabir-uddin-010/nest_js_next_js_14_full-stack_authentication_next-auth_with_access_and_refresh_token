import { IsJWT, IsString } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  @IsJWT()
  token: string;
}
