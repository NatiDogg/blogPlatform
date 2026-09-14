import { Controller,Post,Get,Body,BadRequestException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/registerDto';
import { LoginDto } from './dtos/loginDto';
import { JwtAuthGuard } from './guards/jwtAuthGuard';
import { CurrentUser } from './decorators/currentUserDecorator';
import { User } from 'prisma/generated/prisma/client';
import { Throttle } from '@nestjs/throttler';


@Controller('auth')
export class AuthController {

      constructor(private readonly authService:AuthService){}



      @Throttle({default: {ttl:60000, limit: 5}})
      @Post('register')
      async registerUser(@Body() registerDetails:RegisterDto){
            return await this.authService.register(registerDetails)
      }

      
      
      
      @Throttle({default: {ttl: 60000, limit: 4}})
      @Post("login")
      async loginUser(@Body() loginDetails: LoginDto){
           return await this.authService.login(loginDetails)
      }

      @UseGuards(JwtAuthGuard)
      @Post("refresh")
      async refreshToken(@Body('refreshToken') refreshToken: string){
         if(!refreshToken){
            throw new BadRequestException("Token is Required")
         }
         return await this.authService.refreshToken( refreshToken)
      }

      @UseGuards(JwtAuthGuard)
      @Get('profile')
      async getProfile(@CurrentUser() user:Omit<User, 'password'>){
          return {user: user}
      }
      
}
