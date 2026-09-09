import { Controller,Get,Post,Patch, UseGuards, Body, ParseUUIDPipe, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Role } from 'prisma/generated/prisma/enums';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';
import { RolesGuard } from 'src/auth/guards/rolesGuard';
import { Roles } from 'src/auth/decorators/rolesDecorator';
import { CreateCategoryDto } from './dtos/createCategoryDto';
import { UpdateCategoryDto } from './dtos/updateCategoryDto';

@Controller('category')
export class CategoryController {

       constructor(private readonly categoryService: CategoryService){}


     @Roles(Role.ADMIN)
     @UseGuards(JwtAuthGuard,RolesGuard)
     @Post()
     async createCategory(@Body() categoryDetails:CreateCategoryDto){
          return await this.categoryService.createCategory(categoryDetails)
     }
  
     @UseGuards(JwtAuthGuard,RolesGuard)
     @Get()
     async getCategories(){
         return await this.categoryService.getCategories()
     }
     @UseGuards(JwtAuthGuard,RolesGuard)
     @Get(':id')
     async getCategory(@Param('id',ParseUUIDPipe) id: string){
           return await this.categoryService.getCategory(id)
     }
      @Roles(Role.ADMIN)
     @UseGuards(JwtAuthGuard,RolesGuard)
     @Patch(':id')
     async updateCategory(@Param('id',ParseUUIDPipe) id: string,@Body() categoryDetails: UpdateCategoryDto){
        return await this.categoryService.updateCategory(categoryDetails, id)
     }

     @Roles(Role.ADMIN)
     @UseGuards(JwtAuthGuard,RolesGuard)
     @Delete(':id')
     async deleteCategory(@Param('id',ParseUUIDPipe) id: string){
         return await this.categoryService.deleteCategory(id)
     }
}
