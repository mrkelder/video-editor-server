import { Injectable } from '@nestjs/common';
import type { TokenCombination } from './sign-up.types';

@Injectable()
export class SignUpService {
  getTokenCombination(): TokenCombination {
    return { accessToken: '', refreshToken: '' };
  }
}
