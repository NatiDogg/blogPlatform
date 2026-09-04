import { Injectable,OnModuleDestroy,OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
@Injectable()
export class PrismaService {}
