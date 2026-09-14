import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty,IsOptional,IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateArticleDto{

      @IsNotEmpty({message: 'Title is Required'})
      @IsString({message: 'Title must be a String'})
      @MinLength(4, {message: 'Title must be at least 4 characters '})
      @MaxLength(50,{message: 'Title must not exceed 50 characters long'})
      title!: string


      @IsNotEmpty({message: 'Description is Required'})
      @IsString({message: 'Description  must be a String'})
      @MinLength(4, {message: 'Description  must be at least 4 characters '})
      @MaxLength(100,{message: 'Description  must not exceed 100 characters long'})
      description!: string

      @IsNotEmpty({message: "Category is Required"})
      @IsUUID('all', {message: 'Category ID must be a valid UUID'})
      categoryId!: string

      @IsOptional()
      @IsArray({ message: 'Tags must be an array of strings' })
      @ArrayMinSize(1, {message: 'At least one tag is required'})
      @ArrayMaxSize(10, { message: 'Cannot add more than 10 tags' })
      @IsString({ each: true, message: 'Each tag must be a string' })
      @MinLength(2, { each: true, message: 'Each tag must be at least 2 characters' })
      @MaxLength(20, { each: true, message: 'Each tag must not exceed 20 characters' })
      tags?: string[];



}