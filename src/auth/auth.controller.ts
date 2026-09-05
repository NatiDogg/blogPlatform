import { Controller,Post,Get,Body,BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/registerDto';
import { LoginDto } from './dtos/loginDto';

@Controller('auth')
export class AuthController {

      constructor(private readonly authService:AuthService){}


      @Post('register')
      async registerUser(@Body() registerDetails:RegisterDto){
            return await this.authService.register(registerDetails)
      }

      @Post("login")
      async loginUser(@Body() loginDetails: LoginDto){
           return await this.authService.login(loginDetails)
      }

      @Post("refresh")
      async refreshToken(@Body('refreshToken') refreshToken: string){
         if(!refreshToken){
            throw new BadRequestException("Token is Required")
         }
         return await this.authService.refreshToken( refreshToken)
      }
      
}
