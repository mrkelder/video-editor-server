import { IsEmail } from 'class-validator';

export class RefreshTokenDto {
  @IsEmail() userEmail!: string;
}
