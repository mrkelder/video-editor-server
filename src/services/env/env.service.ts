import { Injectable } from '@nestjs/common';
import { EnvConfig } from './env.types';

@Injectable()
export class EnvService {
  readonly config: EnvConfig;

  constructor() {
    const isProduction = process.env.IS_PRODUCTION;
    const isMockServer = process.env.IS_MOCK_SERVER;
    const awsCognitoUserPoolId = process.env.AWS_COGNITO_USER_POOL_ID;

    if (!awsCognitoUserPoolId || awsCognitoUserPoolId?.length === 0)
      throw new Error('AWS Cognito user pool id is missing in .env file');

    this.config = {
      isProduction: typeof isProduction === 'boolean' ? isProduction : false,
      isMockServer: typeof isMockServer === 'boolean' ? isMockServer : false,
      awsCognitoUserPoolId,
    };
  }
}
