import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from 'prisma/generated/prisma/client';

import { RegisterDto } from 'src/auth/dtos/registerDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

     constructor(private prisma:PrismaService){}

     async createUser(userDetails: RegisterDto){
         try {
            return await this.prisma.user.create({data: {
                ...userDetails
            }, omit: {password: true}})
         } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
                throw new ConflictException("Email is Already in use")
            }
            throw error
         }
     }
     async findUserByEmail(email: string){
          return await this.prisma.user.findUnique({where: {email}})
     }
}
