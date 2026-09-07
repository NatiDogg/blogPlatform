import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import {validate} from './utils/envValidation'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthSharedModuleModule } from './auth-shared-module/auth-shared-module.module';
@Module({
  imports: [PrismaModule, ConfigModule.forRoot({
     isGlobal: true,
     validate
  }), AuthModule, UserModule, AuthSharedModuleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
