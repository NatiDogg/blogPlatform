import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class AddCommentDto{

      @IsNotEmpty({message: 'Comment is Required'})
      @IsString({message:"Comment must be a string"})
      @MinLength(2, {message: 'Comment must be atleast 2 characters'})
      @MaxLength(300, {message: 'Comment must not exceed 300 characters'})
      content!: string

}