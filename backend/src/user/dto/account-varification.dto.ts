import { IsJWT, IsString } from 'class-validator';

export class AccountVarificationDto {
  @IsString()
  @IsJWT()
  token: string;
}
