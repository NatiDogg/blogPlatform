import { IsOptional, IsString, MaxLength } from "class-validator";

export class QueryArticleDto{
     
      @IsOptional()
      @IsString({message: 'Title must be a String'})
      @MaxLength(100, {message: 'Title search can not exceed 100'})
      title?: string

      @IsOptional()
      @IsString({message: 'Category must be a string'})
      category?: string

      @IsOptional()
      @IsString()
     sortBy?: string = 'createdAt';
      
     @IsOptional()
     @IsString()
      sortOrder?: 'asc' | 'desc' = 'desc';
 

}