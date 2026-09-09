import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCategoryDto{
    @IsNotEmpty({message: 'Category Name is required'})
        @IsString({message: 'Category Name must be a string'})
        name!: string
}