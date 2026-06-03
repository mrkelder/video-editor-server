import { Injectable } from '@nestjs/common';
import type { TokenCombination } from '../../auth.types';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async doesUserExist(userName: CreateUserDto['userName']): Promise<boolean> {
    const userObject = await Promise.resolve(
      userName === 'admin' ? {} : undefined,
    );

    return !!userObject;
  }

  async addUser({ userName, password }: CreateUserDto): Promise<void> {
    const databaseUpdate = Promise.resolve({ userName, password });

    await databaseUpdate;
  }

  async getTokenCombination(): Promise<TokenCombination> {
    const accessToken = await this.jwtService.signAsync(
      { a: 1, b: 2 },
      { secret: '123' }, // TODO: replace with env secret
    );
    const refreshToken = await this.jwtService.signAsync(
      { a: 1, b: 2 },
      { secret: '123' }, // TODO: replace with env secret
    );
    return { accessToken, refreshToken };
  }
}
