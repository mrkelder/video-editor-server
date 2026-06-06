import { Injectable } from '@nestjs/common';
import type { TokenCombination } from './auth.services.types';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../dto/create-user.dto';

const MOCK_USER = { userName: 'admin', password: 'admin' };

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async verifyUserCredentials(
    userName: string,
    password: string,
  ): Promise<Error | void> {
    const doesUserExist = await this.doesUserExist(userName);
    const areCredentialsValid =
      userName === MOCK_USER.userName && password === MOCK_USER.password;

    if (!doesUserExist || !areCredentialsValid) {
      throw new Error('Credentials are not valid');
    }

    return void 0;
  }

  async doesUserExist(userName: string): Promise<boolean> {
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
