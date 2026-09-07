import { Controller,Param,ParseUUIDPipe,Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';
import { RolesGuard } from 'src/auth/guards/rolesGuard';
import { Roles } from 'src/auth/decorators/rolesDecorator';
import { Role } from 'prisma/generated/prisma/enums';

@Controller('user')
export class UserController {

       constructor(private readonly userService:UserService){}


    
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN)
    
    @Patch(':id/promote-to-author')
    async promoteToAuthor(@Param('id',ParseUUIDPipe) id: string){
         return await this.userService.promoteToAuthor(id)
    }
}
