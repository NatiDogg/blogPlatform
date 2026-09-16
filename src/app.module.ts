import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import {validate} from './utils/envValidation'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { AuthCommonModule } from './auth-shared-module/auth-shared-module.module';
import { ArticleModule } from './articles/article.module';
import { CategoryModule } from './categories/category.module';
import { CommentModule } from './comments/comment.module';
import { TagsModule } from './tags/tags.module';
import { ThrottlerModule,ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [PrismaModule, 
      ThrottlerModule.forRoot({
         throttlers: [
            {
              ttl: 60000,
              limit: 20
            }
         ]
      }),
      CacheModule.register({
           isGlobal: true,
           ttl: 30000,
           max: 100
      })

    ,ConfigModule.forRoot({
     isGlobal: true,
     validate
  }), AuthModule, UserModule, AuthCommonModule, ArticleModule, CategoryModule, CommentModule, TagsModule],
  controllers: [AppController],
  providers: [AppService, {
     provide: APP_GUARD,
     useClass: ThrottlerGuard
  }],
})
export class AppModule {}
