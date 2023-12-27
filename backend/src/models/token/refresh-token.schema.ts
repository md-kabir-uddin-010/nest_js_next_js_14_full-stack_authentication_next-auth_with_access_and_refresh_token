import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Refresh_Token {
  @Prop({
    type: String,
    required: true,
  })
  user_id: string;

  @Prop({
    type: String,
    required: true,
  })
  token: string;
}

export type TokenDocument = Refresh_Token & Document;

export const REFRESH_TOKEN_MODEL = Refresh_Token.name; //Refresh_Token

export const RefreshTokenSchema = SchemaFactory.createForClass(Refresh_Token);
