import { Body, Controller, Post, UseGuards,Get, Delete, Patch, ParseUUIDPipe, Param, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Roles } from 'src/auth/decorators/rolesDecorator';
import { Role } from 'prisma/generated/prisma/enums';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';
import { RolesGuard } from 'src/auth/guards/rolesGuard';
import { CreateArticleDto } from './dtos/createArticleDto';
import { CurrentUser } from 'src/auth/decorators/currentUserDecorator';
import { User } from 'prisma/generated/prisma/client';
import { QueryArticleDto } from './dtos/queryArticleDto';
import { UpdateArticleDto } from './dtos/updateArticleDto';


@Controller('articles')
export class ArticleController {

       constructor(private readonly articleService:ArticleService){}


       @Roles(Role.AUTHOR)
       @UseGuards(JwtAuthGuard,RolesGuard)
       @Post('')
        async createArticle(@Body() articleDetails:CreateArticleDto, @CurrentUser() user: Omit<User, 'password'>){
           return this.articleService.createArticle(articleDetails,user.id)
       }

       @Get()
       async getArticles(@Query() queryDetails:QueryArticleDto){
            return await this.articleService.getArticles(queryDetails)
       }
       
       @Get(':id')
       async getArticle(@Param('id',ParseUUIDPipe) id: string){
           return await this.articleService.getArticle(id)
       }

       @Roles(Role.AUTHOR)
       @UseGuards(JwtAuthGuard,RolesGuard)
       @Get('me')
       async getMyArticles(@CurrentUser() user: Omit<User, 'password'>){
             return await this.articleService.getMyArticles(user.id)
       }

       @Roles(Role.AUTHOR)
       @UseGuards(JwtAuthGuard,RolesGuard)
       @Get('me/:id')
       async getMyArticle(@Param('id',ParseUUIDPipe) id: string, @CurrentUser() user: Omit<User, 'password'> ){
                return await this.articleService.getMyArticle(id, user.id)
       }
 
       @Roles(Role.AUTHOR)
       @UseGuards(JwtAuthGuard,RolesGuard)
       @Patch(':id')
       async updateArticle(@Param('id',ParseUUIDPipe) id: string,@Body() updateDetails: UpdateArticleDto, @CurrentUser() user: Omit<User, 'password'>){
               return await this.articleService.updateArticle(id,updateDetails, user.id)
       }

       @Roles(Role.AUTHOR)
       @UseGuards(JwtAuthGuard, RolesGuard)
       @Patch('publish/:id')
       async publishArticle(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: Omit<User, 'password'>){
              return await this.articleService.publishArticle(id, user.id)
       }
 
       @Roles(Role.AUTHOR, Role.ADMIN)
       @UseGuards(JwtAuthGuard,RolesGuard)
       @Delete(':id')
       async deleteArticle(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: Omit<User, 'password'>){
              return await this.articleService.deleteArticle(id, {id: user.id, role: user.role})
       }
}
