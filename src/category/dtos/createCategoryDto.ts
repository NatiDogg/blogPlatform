import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto{
    @IsNotEmpty({message: 'Category Name is required'})
    @IsString({message: 'Category Name must be a string'})
    @MinLength(4,{message: 'Category Name must be at least 4 characters'})
    @MaxLength(30,{message: 'Category Name must no exceed 30 characters'})
    name!: string
}