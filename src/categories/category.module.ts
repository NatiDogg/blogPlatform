import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AuthCommonModule } from 'src/auth-shared-module/auth-shared-module.module';

@Module({
  providers: [CategoryService],
  controllers: [CategoryController],
  imports:[AuthCommonModule]
})
export class CategoryModule {}
