import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { envConfig } from "./envValidation";
import jwt from 'jsonwebtoken'
import { Role } from "prisma/generated/prisma/enums";
@Injectable()

export class JwtService{
     
     constructor(private readonly configService:ConfigService<envConfig>){}
     
    createAccessToken(userPayload: {id: string, name: string, email: string, role: Role}){
         return jwt.sign(userPayload, this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN'),{expiresIn: '15m'})
    }
    createRefreshToken(userPayload: {id: string, name: string, email: string, role: Role}){
        return jwt.sign(userPayload, this.configService.getOrThrow<string>("JWT_REFRESH_TOKEN"),{expiresIn: '7d'})
    }
    verifyAccessToken(token: string){
        return jwt.verify(token,this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN')) as {
              id: string,
              name: string,
              email: string,
              role: Role
        }
    }
    verifyRefreshToken(token: string){
          return jwt.verify(token,this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN')) as {
              id: string,
              name: string,
              email: string,
              role: Role
        }
    }
}