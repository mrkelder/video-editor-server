import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString() userName!: string;
  @IsString() password!: string;
  @IsString() inviteCode!: string;
}
