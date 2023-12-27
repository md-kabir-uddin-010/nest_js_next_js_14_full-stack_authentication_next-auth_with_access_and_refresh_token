import { Global, Module } from '@nestjs/common';
import { ExceptionService } from './exception.service';
import { SharedService } from './shared.service';

@Global()
@Module({
  providers: [ExceptionService, SharedService],
  exports: [ExceptionService, SharedService],
})
export class SharedModule {}
