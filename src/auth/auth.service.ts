import { Injectable } from '@nestjs/common';
import type { TokenCombination } from './auth.types';

@Injectable()
export class AuthService {
  getTokenCombination(): TokenCombination {
    return { accessToken: '', refreshToken: '' };
  }
}
