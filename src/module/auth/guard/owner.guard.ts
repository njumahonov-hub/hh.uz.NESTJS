import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class OwnerGuard implements CanActivate {
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    const user = request['user'];
    const paramId = +request.params.id; 

    if (!user) {
      throw new UnauthorizedException("Siz tizimga kirmagansiz");
    }

    if (user.id !== paramId) {
      throw new ForbiddenException("Siz faqat o'z profilingizni boshqara olasiz");
    }

    return true;
  }
}