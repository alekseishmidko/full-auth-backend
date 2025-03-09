import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';
import { AuthMethod, User } from '@prisma/__generated__';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { time } from 'console';
@Injectable()
export class AuthService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly config: ConfigService,
  ) {}
  public async register(dto: RegisterDto, req: Request) {
    const isExist = await this.userService.findByEmail(dto.email);

    if (isExist) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const newUser = await this.userService.create(
      dto.email,
      dto.password,
      dto.name,
      '',
      AuthMethod.CREDENTIALS,
      false,
    );
    this.saveSession(req, newUser);
    return newUser;
  }
  public async login(dto: LoginDto, req: Request) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user || !user.password) {
      throw new NotFoundException('пользователь не найден');
    }
    const isValidPassword = await verify(user.password, dto.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Неверный пароль');
    }
    return this.saveSession(req, user);
  }
  public async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'проблема с сервером или сессия уже завершена',
            ),
          );
        }
        res.clearCookie(this.config.getOrThrow<string>('SESSION_NAME'));
        res.status(200).json({ message: 'вы вышли из системы' });
        resolve();
      });
    });
  }
  private async saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'не удалось сохранить сессию, проверьте параметры сессии',
            ),
          );
        }
        resolve({ user });
      });
    });
  }
}
