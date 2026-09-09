import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import {validate} from './utils/envValidation'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthCommonModule } from './auth-shared-module/auth-shared-module.module';
import { ArticleModule } from './article/article.module';
import { CategoryModule } from './category/category.module';
@Module({
  imports: [PrismaModule, ConfigModule.forRoot({
     isGlobal: true,
     validate
  }), AuthModule, UserModule, AuthCommonModule, ArticleModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
