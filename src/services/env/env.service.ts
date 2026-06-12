import { Injectable } from '@nestjs/common';
import { EnvConfig } from './env.types';

@Injectable()
export class EnvService {
  readonly config: EnvConfig;

  constructor() {
    const isProduction = process.env.IS_PRODUCTION;
    const isMockServer = process.env.IS_MOCK_SERVER;

    this.config = {
      isProduction: typeof isProduction === 'boolean' ? isProduction : false,
      isMockServer: typeof isMockServer === 'boolean' ? isMockServer : false,
    };
  }
}
