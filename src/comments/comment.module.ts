import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { AuthCommonModule } from 'src/auth-shared-module/auth-shared-module.module';

@Module({
  providers: [CommentService],
  controllers: [CommentController],
  imports: [AuthCommonModule]
})
export class CommentModule {}
