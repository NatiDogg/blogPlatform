import { IsString,IsNotEmpty,IsEmail, MinLength, MaxLength } from "class-validator";

export class RegisterDto{

    @IsNotEmpty({message: 'Name is Required'})
    @IsString({message: 'Name must be a String'})
    @MinLength(4,{message: 'Name must be atleast 4 characters'})
    @MaxLength(10,{message: 'Name must not exceed 10 characters'})
      name!: string

    @IsNotEmpty({message: "Email is Required"})
    @IsEmail({},{message: "Please Enter a Valid Email"})
     email!: string

    @IsNotEmpty({message: 'Password is Required'})
    @MinLength(6,{message: 'Password must be atleast 6 characters'})
      password!: string
    



}