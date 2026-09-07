import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtService } from 'src/utils/jwtService';
import { BcryptService } from 'src/utils/bcryptService';
import {PassportModule} from '@nestjs/passport'
import { JwtStrategy } from './strategies/jwtStrategy';
import { RolesGuard } from './guards/rolesGuard';
@Module({
  imports: [UserModule, PassportModule.register({defaultStrategy: 'jwt'})],
  providers: [AuthService,JwtService,BcryptService,JwtStrategy,RolesGuard],
  controllers: [AuthController],
  exports:[AuthService,RolesGuard,PassportModule,JwtStrategy]
})
export class AuthModule {}
