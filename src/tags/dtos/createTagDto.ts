import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTagDto{
      
      @IsNotEmpty({message: 'Tags are Required'})
      @IsArray({message: 'Tags must be an array'})
      @ArrayMinSize(1, {message: 'At least one tag is required'})
      @ArrayMaxSize(10, { message: 'Cannot add more than 10 tags' })
      @IsString({ each: true, message: 'Each tag must be a string' })
      @MinLength(2, { each: true, message: 'Each tag must be at least 2 characters' })
      @MaxLength(20, { each: true, message: 'Each tag must not exceed 20 characters' })
      tags!: string[]
}