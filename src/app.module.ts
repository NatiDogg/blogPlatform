import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import {validate} from './utils/envValidation'
@Module({
  imports: [PrismaModule, ConfigModule.forRoot({
     isGlobal: true,
     validate
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
