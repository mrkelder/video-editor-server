import { IsEmail, IsString } from 'class-validator';

export class LogInUserDto {
  @IsEmail() userEmail!: string;
  @IsString() password!: string;
}
