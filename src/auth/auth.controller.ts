import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  public async register(@Body() dto: RegisterDto, @Req() req: Request) {
    return this.authService.register(dto, req);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(dto, req);
  }
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(@Req() req: Request, @Res() res: Response) {
    return this.authService.logout(req, res);
  }
}
