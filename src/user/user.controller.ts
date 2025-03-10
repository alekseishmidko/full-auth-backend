import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Authorized } from '@/auth/decorators/authorizate.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  public async findProfile(@Authorized('id') id: string) {
    return this.userService.findById(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('by-id/:id')
  public async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
