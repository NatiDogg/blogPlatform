import {  BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dtos/createArticleDto';
import { Prisma } from 'prisma/generated/prisma/client';

@Injectable()
export class ArticleService {

       constructor(private prisma:PrismaService  ){}

      async createArticle(articleDetails: CreateArticleDto, authorId: string){
          
          try {
        const newlyCreatedArticle = await this.prisma.article.create({
            data: {
                ...articleDetails,
                authorId: authorId,
            },
            include: {
                author: {include:{user: {omit: {password: true}}}},
                tags: true,
                category: true
            }
        })

        return {
            success: true,
            message: 'Article Created Successfully',
            article: newlyCreatedArticle
        }

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new BadRequestException("Category not found")
        }
        throw error
    }

      }

      async getArticles(){
         
            return await this.prisma.article.findMany(
                  {where: {status: 'PUBLISHED', deletedAt: null},
                   include: {author: {include: {user: {omit: {password: true}}}}, category: true, comments: true, tags: true}})

      }

      async getArticle(id: string){
                
      }
      async getMyArticles(){

      }
      async getMyArticle(){

      }

      async updateArticle(){

      }

      async deleteArticle(){

      }
      
}
