import { CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/rolesDecorator";
import { Role } from "prisma/generated/prisma/enums";


export class RolesGuard implements CanActivate{
       
        constructor(private reflector: Reflector){}
     
      canActivate(context: ExecutionContext): boolean {
           const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()])

           if(!requiredRoles){
            return true
           }
           const {user} = context.switchToHttp().getRequest()

           if(!user){
             throw new UnauthorizedException("User is not authenticated");
           }

           const hasRequiredRole = requiredRoles.includes(user.role)

           if(!hasRequiredRole){
              throw new ForbiddenException('Access denied. You do not have the required permissions.');
           }

           return true
      }
}





