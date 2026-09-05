import { IsString,IsNotEmpty,IsEmail, MinLength, MaxLength } from "class-validator";
export class LoginDto{
     
      @IsNotEmpty({message: "Email is Required"})
      @IsEmail({},{message: "Please Enter a Valid Email"})
        email!: string

      @IsNotEmpty({message: 'Password is Required'})
      @MinLength(6,{message: 'Name must be atleast 4 characters'})
        password!: string
}