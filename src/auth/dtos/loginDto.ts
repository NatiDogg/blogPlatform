import { IsString,IsNotEmpty,IsEmail, MinLength } from "class-validator";
export class LoginDto{
     
      @IsNotEmpty({message: "Email is Required"})
      @IsEmail({},{message: "Please Enter a Valid Email"})
        email!: string

      @IsNotEmpty({message: 'Password is Required'})
      @MinLength(6,{message: 'Password must be atleast 6 characters'})
        password!: string
}