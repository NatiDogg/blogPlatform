import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Role } from "prisma/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";

import { envConfig } from "src/utils/envValidation";

@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy){


         constructor(private configService: ConfigService<envConfig>, private prisma: PrismaService){
             super({
                 jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                 secretOrKey: configService.getOrThrow<string>("JWT_ACCESS_TOKEN"),
                 ignoreExpiration: false
             })
         }

         async validate(payload: { id: string,
                       name: string,
                       email: string,
                       role: Role}) {

             const user = await this.prisma.user.findUnique({where: {id: payload.id}, omit: {password: true}})
             if(!user){
                throw new UnauthorizedException("User Not Found")
             }
             return user
         }
        
    
}