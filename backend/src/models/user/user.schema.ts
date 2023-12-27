import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { compare, hash } from 'bcrypt';
import { Document } from 'mongoose';
import {
  ACCOUNT_STATUS,
  SIGNUP_STRATEGY,
  USER_TYPE,
} from '../../../utils/enums/user_registration_type_enum';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: String,
    min: 3,
    max: 30,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    min: 8,
    max: 30,
    select: false,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    default: 'default.png',
  })
  profile_pic: string;

  @Prop({
    type: String,
    enum: Object.keys(ACCOUNT_STATUS),
    default: ACCOUNT_STATUS.APPROVAL_PENDING,
  })
  account_status: string;

  @Prop({
    type: String,
    enum: Object.keys(SIGNUP_STRATEGY),
    default: SIGNUP_STRATEGY.EMAIL,
  })
  signup_strategy: string;

  @Prop({
    type: String,
    enum: Object.keys(USER_TYPE),
    default: USER_TYPE.USER,
  })
  user_role: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  email_verified: boolean;

  isValidPassword: (candidatePassword: string) => Promise<boolean>;
}

export type UserDocument = User & Document;

export const USER_MODEL = User.name; //User

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: Function) {
  const hashPassword = await hash(this.password, 10);
  this.password = hashPassword;
  next();
});

UserSchema.method(
  'isValidPassword',
  async function (candidatePassword: string) {
    const hashedPassword = this.password;
    const isMatched = await compare(candidatePassword, hashedPassword);
    return isMatched;
  },
);
