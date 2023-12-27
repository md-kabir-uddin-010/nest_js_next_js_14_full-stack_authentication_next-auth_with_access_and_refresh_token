import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Verification_Token {
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

export type VerificationTokenDocument = Verification_Token & Document;

export const VERIFICATION_TOKEN_MODEL = Verification_Token.name; //Verification_Token

export const VerificationTokenSchema =
  SchemaFactory.createForClass(Verification_Token);
