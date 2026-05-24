import { Injectable } from '@nestjs/common';
import type { TokenCombination } from './auth.types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

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
