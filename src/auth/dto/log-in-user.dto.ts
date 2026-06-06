import { IsString } from 'class-validator';

export class LogInUserDto {
  @IsString() userName!: string;
  @IsString() password!: string;
}
