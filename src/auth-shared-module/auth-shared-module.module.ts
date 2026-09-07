import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';
import { RolesGuard } from 'src/auth/guards/rolesGuard';
import { JwtStrategy } from 'src/auth/strategies/jwtStrategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy, RolesGuard, JwtAuthGuard],
  exports: [PassportModule, JwtStrategy, RolesGuard, JwtAuthGuard],
})
export class AuthCommonModule {}
