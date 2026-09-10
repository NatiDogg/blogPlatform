import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddCommentDto } from './dtos/addCommentDto';
import { UpdateCommentDto } from './dtos/updateCommentDto';
import { Prisma, Role } from 'prisma/generated/prisma/client';


@Injectable()
export class CommentService {

       constructor(private prisma:PrismaService){}

       async addComment(articleId: string, userId: string,comment: AddCommentDto){
          const article = await this.prisma.article.findUnique({
        where: { id: articleId, status: 'PUBLISHED', deletedAt: null }
    })
        if(!article){
               throw new NotFoundException("Article not found")
        }
            const newlyAddedComment = await this.prisma.comment.create({data: {
                 userId,
                 articleId,
                 createdAt: new Date(),
                 ...comment

            }})

            return {
                 success: true,
                 message: "Comment added Successfully",
                 comment: newlyAddedComment
            }
       }
       

       async getComments(articleId: string){
          const comments = await this.prisma.comment.findMany({
             where: {articleId},
             include: {user: {select: {id: true, name: true, email: true,}}},
             orderBy: {createdAt: 'desc'}
          })
            return {
                success: true,
                message: "Comments Retrieved Successfully",
                comments: comments
            }
       }

       
       async editComment(commentId: string, userId: string, comment: UpdateCommentDto){
            try {
                const editedComment = await this.prisma.comment.update({where: {
                      id: commentId,
                      userId: userId
                }, data: {
                    
                      updatedAt: new Date(),
                        ...comment

                }, select: {content: true, id: true, updatedAt: true}})

                return {
                    success: true,
                    message: 'Comment Edited Successfully',
                    comment: editedComment
                }
            } catch (error) {
                if(error instanceof Prisma.PrismaClientKnownRequestError){
                    if(error.code === 'P2025'){
                     throw new NotFoundException('Comment not found or you are not authorized to edit it');
                    } 
                }
                throw error
            }
       }

       async deleteComment(commentId: string, user: {id: string, role: Role}){
            
            try {
                const isAdmin = user.role === 'ADMIN'

            const result = await this.prisma.comment.delete({
                where: {
                     id: commentId,
                     
                     ...(isAdmin ? {} : {
                         OR: [
                             {userId: user.id},
                             {article: {authorId: user.id}}
                         ]
                     })
                     
                }
            })
            return {
                success: true,
                message: 'Comment Deleted Successfully'
            }
            } catch (error) {
                if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025"){
                    throw new NotFoundException('Comment not found or you are not authorized to delete it')
                }

                throw error
            }


       }
}
