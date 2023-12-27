import { Global, Module } from '@nestjs/common';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import {
  REFRESH_TOKEN_MODEL,
  RefreshTokenSchema,
  VERIFICATION_TOKEN_MODEL,
  VerificationTokenSchema,
} from './token';
import {
  USER_META_MODEL,
  USER_MODEL,
  UserMetaSchema,
  UserSchema,
} from './user';

const Models: ModelDefinition[] = [
  { name: USER_MODEL, schema: UserSchema },
  { name: USER_META_MODEL, schema: UserMetaSchema },
  { name: REFRESH_TOKEN_MODEL, schema: RefreshTokenSchema },
  { name: VERIFICATION_TOKEN_MODEL, schema: VerificationTokenSchema },
];

@Global()
@Module({
  imports: [MongooseModule.forFeature(Models)],
  exports: [MongooseModule],
})
export class MongooseModelsModule {}
