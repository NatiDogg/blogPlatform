import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dtos/createArticleDto';

@Injectable()
export class ArticleService {

       constructor(private prisma:PrismaService  ){}

      async createArticle(articleDetails: CreateArticleDto, authorId: string){
          
            if(!authorId){
                  throw new BadRequestException("Author Id is Required")
            }



          

      }

      async getArticles(){

      }

      async getArticle(){

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
