import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly userService: UserService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (typeof request.session.userId === 'undefined') {
      throw new UnauthorizedException('Пользоватеь не авторизован');
    }
    const user = await this.userService.findById(request.session.userId);

    if (!user) {
      throw new UnauthorizedException(
        'Пользователь не найден, убедитесь в правильности данных',
      );
    }

    request.user = user;

    return true;
  }
}
