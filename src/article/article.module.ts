import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { AuthCommonModule } from 'src/auth-shared-module/auth-shared-module.module';

@Module({
  providers: [ArticleService],
  controllers: [ArticleController],
  imports: [AuthCommonModule]
})
export class ArticleModule {}
