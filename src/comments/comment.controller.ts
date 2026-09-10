import { Controller,Get,Post,Patch,Delete, UseGuards, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';
import { AddCommentDto } from './dtos/addCommentDto';
import { CurrentUser } from 'src/auth/decorators/currentUserDecorator';
import { User } from 'prisma/generated/prisma/client';
import { UpdateCommentDto } from './dtos/updateCommentDto';

@Controller('comments')
export class CommentController {

        constructor(private readonly commentService:CommentService){}

        @UseGuards(JwtAuthGuard)
        @Post(':id')
        async addComment(@Param('id', ParseUUIDPipe) id: string,@Body() comment:AddCommentDto, @CurrentUser() user: Omit<User, 'password'>){
             return await this.commentService.addComment(id, user.id, comment)
        }

        @UseGuards(JwtAuthGuard)
        @Get(':id')
        async getComments(@Param('id',ParseUUIDPipe) id: string){
            return await this.commentService.getComments(id)
        }

        @UseGuards(JwtAuthGuard)
        @Patch(":id")
        async editComment(@Param('id',ParseUUIDPipe) id: string, @Body() commentDetails:UpdateCommentDto, @CurrentUser() user: Omit<User, 'password'>){
            return await this.commentService.editComment(id,user.id,commentDetails)
        }

        @UseGuards(JwtAuthGuard)
        @Delete(':id')
        async deleteComment(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: Omit<User, 'password'> ){
             return await this.commentService.deleteComment(id, {id: user.id, role: user.role})
        }
}
