import { Injectable, InternalServerErrorException } from "@nestjs/common";
import bcrypt from 'bcrypt'
@Injectable()

export class BcryptService{
       
     async hashPassword(password: string){
         try {
            return await bcrypt.hash(password,10)
         } catch (error) {
            console.log(error)
            throw new InternalServerErrorException("Failed to hash password")
         }
     }
     async matchPassword(password: string, hashedPassword: string){
           try { 
               return await bcrypt.compare(password,hashedPassword)
           } catch (error) {
               console.log(error)
               throw new InternalServerErrorException("Failed to verify password")
           }
     }
}