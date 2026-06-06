import { Injectable } from '@nestjs/common';
import type {
  JwtTokenCombination,
  Temporary_User as User,
  Tepmorary_JwtTokenPayload as JwtTokenPayload,
} from './auth.services.types';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../dto/create-user.dto';

const MOCK_USER_CREDENTIALS = { userName: 'admin', password: 'admin' };
const MOCK_JWT_SECRET = '0001';
const MOCK_USER: User = {
  id: String(Math.floor(Math.random() * 100000)),
  userName: MOCK_USER_CREDENTIALS.userName,
};

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async verifyUserCredentials(
    userName: string,
    password: string,
  ): Promise<void> {
    const doesUserExist = await this.doesUserExist(userName);
    const areCredentialsValid =
      userName === MOCK_USER_CREDENTIALS.userName &&
      password === MOCK_USER_CREDENTIALS.password;

    if (!doesUserExist || !areCredentialsValid) {
      throw new Error('Credentials are not valid');
    }

    return void 0;
  }

  async doesUserExist(userName: string): Promise<boolean> {
    return !!(await this.getUserByUserName(userName));
  }

  async getUserByUserName(userName: string): Promise<User> {
    const user = await Promise.resolve(MOCK_USER);

    if (userName === MOCK_USER_CREDENTIALS.userName) return user;
    else throw new Error('User does not exist');
  }

  async addUser({ userName, password }: CreateUserDto): Promise<User> {
    const databaseUpdate = Promise.resolve({
      userName,
      password,
    });

    await databaseUpdate;

    return MOCK_USER;
  }

  async getTokenCombination(userId: User['id']): Promise<JwtTokenCombination> {
    const jwtTokenPayload: JwtTokenPayload = { userId };
    const accessToken = await this.jwtService.signAsync(
      jwtTokenPayload,
      { secret: MOCK_JWT_SECRET }, // TODO: replace with env secret
    );
    const refreshToken = await this.jwtService.signAsync(
      jwtTokenPayload,
      { secret: MOCK_JWT_SECRET }, // TODO: replace with env secret
    );

    return { accessToken, refreshToken };
  }

  async verifyRefreshToken(refreshToken: string): Promise<void> {
    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: MOCK_JWT_SECRET,
      });

      return void 0;
    } catch {
      throw new Error('Refresh token invalid');
    }
  }
}
