import {  BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dtos/createArticleDto';
import { Prisma, Role } from 'prisma/generated/prisma/client';
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
              const article =  await this.prisma.article.findUnique({
                        where: {id, deletedAt: null, status: 'PUBLISHED'},

                  })
                  if(!article){
                         throw new NotFoundException("Article Not Found")
                  }
                  return {
             success: true,
             message: "Article Retrieved Successfully",
             articles: article
          }
      }
      async getMyArticles(authorId: string){
      const articles = await this.prisma.article.findMany({
             where: {
                   authorId
             },
             orderBy: {createdAt: 'desc'}
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
          if(!article){
            throw new NotFoundException("Article Not Found")
          }

          return {
             success: true,
             message: "Article Retrieved Successfully",
             article: article
          }
      }

      async updateArticle(articleId: string,updateDetails:UpdateArticleDto, authorId: string){
            try {
                 const updatedArticle = await this.prisma.article.update({
                  where: {
                        id: articleId,
                        authorId,
                        deletedAt: null
                  },
                  data: {
                        ...updateDetails

                  },
                  include: {
                        category: true,
                        tags: true
                  }
                 }) 
                 return {
                  success: true,
                  message: "Article Updated Successfully",
                  article: updatedArticle
                 }
            } catch (error) {
               if(error instanceof Prisma.PrismaClientKnownRequestError){
                  if(error.code === 'P2025'){
                    throw new NotFoundException("Article not found or you do not have permission to update it.")
                  }
                  
               }
               throw error
            }
      }

      async publishArticle(articleId: string,authorId: string){

            try {
                  const publishedArticle = await this.prisma.article.update({
                        where:{
                              id: articleId,
                              authorId,
                              status: 'DRAFT',
                              deletedAt: null,
                             
                        }, 
                        data: {
                               status: 'PUBLISHED',
                               publishedAt: new Date()
                        }})
                        return {
                          success: true,
                          message: "Article Published Successfully",
                            article: publishedArticle
                         }
                  
            } catch (error) {
                  if(error instanceof Prisma.PrismaClientKnownRequestError){
                  if(error.code === 'P2025'){
                    throw new NotFoundException("Article not found, already published, or you do not have permission to publish it")
                  }
                  
               }
               throw error
            }
   
      }

      async deleteArticle(articleId: string, user: {id: string, role: Role}){

             try {
                  const whereCondition = user.role === "AUTHOR" ? {
                   id: articleId,
                   authorId: user.id
             } : {
                  id: articleId
             }
            await this.prisma.article.update({
                   where: {
                        deletedAt: null,
                         ...whereCondition
                         

                   },
                   data: {
                        deletedAt: new Date()

                   }
            })

            return {
                  success: true,
                  message: 'Article Deleted Successfully'
            }
             } catch (error) {
                  if(error instanceof Prisma.PrismaClientKnownRequestError){
                  if(error.code === 'P2025'){
                    throw new NotFoundException("Article not found, already deleted, or you do not have permission to delete it")
                  }
                  
               }
               throw error
             }
      }
      
}
