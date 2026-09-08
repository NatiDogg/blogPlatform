import {  BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dtos/createArticleDto';
import { Prisma } from 'prisma/generated/prisma/client';
import { QueryArticleDto } from './dtos/queryArticleDto';

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

      async getArticles(query:QueryArticleDto){

            const {title,category,sortBy= 'createdAt',sortOrder='desc'} = query

             const titleCondition = title
    ? { title: { contains: title, mode: 'insensitive' as const } }
    : {};
    const categoryCondition = category
    ? {
        category: {
          name: {
            equals: category,
            mode: 'insensitive' as const,
          },
        },
      }
    : {};

             
             

             

           



             
         
            return await this.prisma.article.findMany(
                  {where: { 
                        
                        status: 'PUBLISHED', 
                         deletedAt: null,
                        ...titleCondition,
                        ...categoryCondition
                  },
                   include: {author: {include: {user: {omit: {password: true}}}}, category: true, comments: true, tags: true}, orderBy:{[sortBy] : sortOrder} })

      }

      async getArticle(id: string){
            try {
                  return await this.prisma.article.findUnique({
                        where: {id, deletedAt: null, status: 'PUBLISHED'},

                  })
            } catch (error) {
                if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'){
                  throw new NotFoundException("Article Not Found")
                }
                throw error
            }
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
