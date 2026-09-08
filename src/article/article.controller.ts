import { Body, Controller, Post, UseGuards,Get, Delete, Patch, ParseUUIDPipe, Param } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Roles } from 'src/auth/decorators/rolesDecorator';
import { Role } from 'prisma/generated/prisma/enums';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';
import { RolesGuard } from 'src/auth/guards/rolesGuard';
import { CreateArticleDto } from './dtos/createArticleDto';
import { CurrentUser } from 'src/auth/decorators/currentUserDecorator';
import { User } from 'prisma/generated/prisma/client';


@Controller('article')
export class ArticleController {

       constructor(private readonly articleService:ArticleService){}


       @Roles(Role.AUTHOR)
       @UseGuards(JwtAuthGuard,RolesGuard)
       @Post('')
        async createArticle(@Body() articleDetails:CreateArticleDto, @CurrentUser() user: Omit<User, 'password'>){
           return this.articleService.createArticle(articleDetails,user.id)
       }

       @Get()
       async getArticles(){
            return await this.articleService.getArticles()
       }
       
       @Get(':id')
       async getArticle(@Param('id',ParseUUIDPipe) id: string){
           return await this.articleService.getArticle(id)
       }

       @Roles(Role.AUTHOR)
       @UseGuards(JwtAuthGuard,RolesGuard)
       @Get('me')
       async getMyArticles(){

       }

       @Roles(Role.AUTHOR)
       @UseGuards(JwtAuthGuard,RolesGuard)
       @Get('me/:id')
       async getMyArticle(){
        
       }
 
       @Roles(Role.AUTHOR)
       @UseGuards(JwtAuthGuard,RolesGuard)
       @Patch(':id')
       async updateArticle(){

       }
 
       @Roles(Role.AUTHOR, Role.ADMIN)
       @UseGuards(JwtAuthGuard,RolesGuard)
       @Delete(':id')
       async deleteArticle(){

       }
}
