import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { USER_MODEL } from './user.schema';

@Schema({
  timestamps: true,
})
export class User_Meta {
  @Prop({
    type: Types.ObjectId,
    ref: USER_MODEL,
    required: true,
  })
  user_id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  ip: string;

  @Prop({
    type: String,
    required: true,
  })
  country: string;

  @Prop({
    type: String,
    required: true,
  })
  user_agent: string;

  @Prop({
    type: String,
    required: true,
  })
  os: string;
}

export type UserMetaDocument = User_Meta & Document;

export const USER_META_MODEL = User_Meta.name; //User_Meta

export const UserMetaSchema = SchemaFactory.createForClass(User_Meta);
