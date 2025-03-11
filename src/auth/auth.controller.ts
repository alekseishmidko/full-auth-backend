import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { AuthProviderGuard } from './guard/provider.guard';
import { ProviderService } from './provider/provider.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly providerService: ProviderService,
    private readonly configService: ConfigService,
  ) {}

  @Recaptcha()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  public async register(@Body() dto: RegisterDto, @Req() req: Request) {
    return this.authService.register(dto, req);
  }
  @Recaptcha()
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

  @UseGuards(AuthProviderGuard)
  @Get('/oauth/connect/:provider')
  public async connect(@Param('provider') provider: string) {
    const providerInstance = this.providerService.findByService(provider);

    return {
      url: providerInstance.getAuthUrl(),
    };
  }

  @UseGuards(AuthProviderGuard)
  @Get('/oauth/callback/:provider')
  public async callback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('code') code: string,
    @Param('provider') provider: string,
  ) {
    if (!code) {
      throw new BadRequestException('Не был предоставлен код авторизации.');
    }

    await this.authService.extractProfileFromCode(req, provider, code);

    return res.redirect(
      `${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/dashboard/settings`,
    );
  }
}
