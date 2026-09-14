import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { AuthCommonModule } from 'src/auth-shared-module/auth-shared-module.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [AuthCommonModule],
  exports:[UserService]

})
export class UserModule {}
