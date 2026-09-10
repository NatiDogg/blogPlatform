import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/users/user.module';
import { JwtService } from 'src/utils/jwtService';
import { BcryptService } from 'src/utils/bcryptService';
import { AuthCommonModule } from 'src/auth-shared-module/auth-shared-module.module';

@Module({
  imports: [UserModule,AuthCommonModule],
  providers: [AuthService,JwtService,BcryptService],
  controllers: [AuthController],
  exports:[AuthService]
})
export class AuthModule {}
