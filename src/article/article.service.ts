import {  BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dtos/createArticleDto';
import { Prisma } from 'prisma/generated/prisma/client';
import { QueryArticleDto } from './dtos/queryArticleDto';
import { UpdateArticleDto } from './dtos/updateArticleDto';

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
                  const article =  await this.prisma.article.findUnique({
                        where: {id, deletedAt: null, status: 'PUBLISHED'},

                  })
                  return {
             success: true,
             message: "Article Retrieved Successfully",
             articles: article
          }
            } catch (error) {
                if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'){
                  throw new NotFoundException("Article Not Found")
                }
                throw error
            }
      }
      async getMyArticles(authorId: string){
      const articles = await this.prisma.article.findMany({
             where: {
                   authorId
             }
           })
            return {
             success: true,
             message: "Articles Retrieved Successfully",
             articles: articles
          }
      }
      async getMyArticle(articleId: string, authorId: string){
         const article =  await this.prisma.article.findUnique({
            where: {
                  id: articleId,
                  authorId
            }
          })

          return {
             success: true,
             message: "Article Retrieved Successfully",
             article: article
          }
      }

      async updateArticle(updateDetails:UpdateArticleDto, authorId: string){

      }

      async deleteArticle(){

      }
      
}
