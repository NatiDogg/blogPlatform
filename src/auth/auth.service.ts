import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/registerDto';
import { LoginDto } from './dtos/loginDto';
import { UserService } from 'src/user/user.service';
import { BcryptService } from 'src/utils/bcryptService';
import { JwtService } from 'src/utils/jwtService';
import { User } from 'prisma/generated/prisma/client';


@Injectable()
export class AuthService {

      constructor(
        private readonly userService: UserService,
        private readonly bcryptService:BcryptService,
        private readonly jwtService:JwtService
    ){}

      async register(registerDetails:RegisterDto){
          const normalizedEmail = registerDetails.email.toLowerCase()

          const existingUser = await this.userService.findUserByEmail(normalizedEmail)

          if(existingUser){
               throw new ConflictException('A user with this email address already exists.')
          }

          const hashedPassword = await this.bcryptService.hashPassword(registerDetails.password)

          const registeredUser = await this.userService.createUser({name: registerDetails.name, email: normalizedEmail, password: hashedPassword})


        return this.generateUserResponse(registeredUser, 'User Registered Successfully')
          






      }

      async login(loginDetails: LoginDto){

      }

      async refreshToken(token: string){

      }

      private generateUserResponse(user: Omit<User, 'password'>, message: string){
            
         const payload = {
             id: user.id,
             name: user.name,
             email: user.email,
             role: user.role
         }

         const accessToken = this.jwtService.createAccessToken(payload)
         const refreshToken = this.jwtService.createRefreshToken(payload)

         return {
            success: true,
            message: message,
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken
         }
      }
}
