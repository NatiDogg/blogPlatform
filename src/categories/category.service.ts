import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dtos/createCategoryDto';
import { Prisma } from 'prisma/generated/prisma/client';
import { UpdateCategoryDto } from './dtos/updateCategoryDto';


@Injectable()
export class CategoryService {

       constructor(private prisma:PrismaService){}

       async createCategory(categoryDetails:CreateCategoryDto){

           try {
              const newlyCreatedCategory = await this.prisma.category.create({data: {
                  ...categoryDetails
              }})

              return {
                 success: true,
                message: 'Category Created Successfully',
                category: newlyCreatedCategory


              }
           } catch (error) {
               if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
                 throw new BadRequestException("Category with this name already exists")
               }
               throw error
           }

       }

       async getCategories(){
             
           const categories = await this.prisma.category.findMany()

           return {
            success: true,
            message: "Categories Retrieved Successfully",
            categories: categories
           }
       }

       async getCategory(categoryId: string){
            const category = await this.prisma.category.findUnique({where: {id: categoryId}})

            if(!category){
                throw new NotFoundException("Category Not Found")
            }
             return {
            success: true,
            message: "Category Retrieved Successfully",
            category: category
           }

       }
       async updateCategory(categoryDetails: UpdateCategoryDto,categoryId: string){
            try {
                 const updatedCategory = await this.prisma.category.update({where: {
                  id: categoryId
             }, data: {
                  ...categoryDetails
             }})

             return {
                 success: true,
                 message: "Category Updated Successfully",
                 category: updatedCategory
             }
            } catch (error) {
                 if(error instanceof Prisma.PrismaClientKnownRequestError ){
                     if(error.code === 'P2002'){
                        throw new BadRequestException("Category with that name already exists")
                     }
                     if(error.code === 'P2025'){
                        throw new NotFoundException("Category Not Found")
                     }
                 }
                 throw error
            }
       }
       async deleteCategory(categoryId: string){
              const result = await this.prisma.category.deleteMany({
                 where: {
                    id: categoryId,
                    articles: {none: {}}
                 }
              })

              if(result.count === 0){
                 throw new BadRequestException("Cannot delete category: either it does not exist or it has associated articles");
              }

              return {
                 success: true,
                 message: "Category deleted Successfully"

              }
       }
}
