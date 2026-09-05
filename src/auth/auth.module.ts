import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtService } from 'src/utils/jwtService';
import { BcryptService } from 'src/utils/bcryptService';

@Module({
  imports: [UserModule],
  providers: [AuthService,JwtService,BcryptService],
  controllers: [AuthController],
  exports:[AuthService]
})
export class AuthModule {}
