import { IsPasswordMatchingConstraint } from '@/libs/common/decorators/is-password-matching-constraint.decorator';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Validate(IsPasswordMatchingConstraint, { message: 'Пароли не совпадают' })
  passwordRepeat: string;
}
