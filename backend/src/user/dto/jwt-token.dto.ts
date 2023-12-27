import { IsJWT, IsString } from 'class-validator';

export class JWTTokenDto {
  @IsString()
  @IsJWT()
  token: string;
}
