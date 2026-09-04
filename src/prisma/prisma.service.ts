import { Injectable,OnModuleDestroy,OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'prisma/generated/prisma/client';
import { ConfigService } from '@nestjs/config';
import { envConfig } from 'src/utils/envValidation';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit,OnModuleDestroy {
       
     constructor(private configService: ConfigService<envConfig>){
        const adapter = new PrismaPg({connectionString: configService.get<string>("DATABASE_URL")})
        super({adapter})
     }

     async onModuleInit() {
         
     }
     async onModuleDestroy() {
         await this.$disconnect()
     }
     
}
