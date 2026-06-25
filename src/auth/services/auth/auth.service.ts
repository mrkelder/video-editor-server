import { Injectable } from '@nestjs/common';
import type {
  JwtTokenCombination,
  Temporary_User as User,
  Tepmorary_JwtTokenPayload as JwtTokenPayload,
} from './auth.services.types';
import { CreateUserDto } from '../../dto/create-user.dto';
import {
  AdminCreateUserCommand,
  AdminGetUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig,
  InitiateAuthCommand,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import { EnvService } from 'src/services/env';
import crypto from 'crypto';

const cognitoIdentityProviderClientConfig: CognitoIdentityProviderClientConfig =
  {};

@Injectable()
export class AuthService {
  // TODO: rename to cognitoClient
  private readonly congitoClient = new CognitoIdentityProviderClient(
    cognitoIdentityProviderClientConfig,
  );

  constructor(private envService: EnvService) {}

  async verifyUserCredentials(
    userEmail: string,
    password: string,
  ): Promise<boolean> {
    // TODO: replace with AWS Cognito implementation
    const result = Promise.resolve(userEmail !== password);

    return result;
  }

  async doesUserExist(userEmail: string): Promise<boolean> {
    try {
      await this.getUserByEmail(userEmail);
      return true;
    } catch (error) {
      if (error instanceof UserNotFoundException) return false;
      else throw error;
    }
  }

  async getUserByEmail(userEmail: string): Promise<User> {
    const getUser = new AdminGetUserCommand({
      Username: userEmail,
      UserPoolId: this.envService.config.awsCognitoUserPoolId,
    });

    const cognitoUser = await this.congitoClient.send(getUser);
    const cognitoUserId = cognitoUser.UserAttributes?.find(
      ({ Name }) => Name === 'sub',
    )?.Value;
    const cognitoUserEmail = cognitoUser.UserAttributes?.find(
      ({ Name }) => Name === 'email',
    )?.Value;

    if (!cognitoUserId || !cognitoUserEmail)
      throw new Error('Unable to access user attributes');

    const user: User = { id: cognitoUserId, email: cognitoUserEmail };

    return user;
  }

  async addUser({ email, password }: CreateUserDto): Promise<void> {
    this.validatePassword(password);

    try {
      const createUser = new AdminCreateUserCommand({
        Username: email,
        UserPoolId: this.envService.config.awsCognitoUserPoolId,
        UserAttributes: [{ Name: 'email', Value: email }],
      });
      const setUserPassword = new AdminSetUserPasswordCommand({
        Username: email,
        Password: password,
        UserPoolId: this.envService.config.awsCognitoUserPoolId,
        Permanent: true,
      });

      await this.congitoClient.send(createUser);
      await this.congitoClient.send(setUserPassword);
    } catch (error) {
      console.log(error);
      throw new Error('Could not create user');
    }
  }

  private validatePassword(password: string) {
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      throw new Error('Password must contain an uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      throw new Error('Password must contain a lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      throw new Error('Password must contain a number');
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      throw new Error('Password must contain a symbol');
    }

    return true;
  }

  async getTokenCombination(
    userEmail: string,
    userPassword: string,
  ): Promise<JwtTokenCombination> {
    const getUserTokens = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.envService.config.awsCognitoClientId,
      AuthParameters: {
        USERNAME: userEmail,
        PASSWORD: userPassword,
        SECRET_HASH: this.getAwsCognitoSecretHash(userEmail),
      },
    });

    const { AuthenticationResult } =
      await this.congitoClient.send(getUserTokens);

    if (
      !AuthenticationResult ||
      !AuthenticationResult.AccessToken ||
      !AuthenticationResult.RefreshToken
    )
      throw new Error('Failed to retrieve token combination');

    const jwtTokenCombination = await Promise.resolve({
      accessToken: AuthenticationResult.AccessToken,
      refreshToken: AuthenticationResult.RefreshToken,
    });

    return jwtTokenCombination;
  }

  private getAwsCognitoSecretHash(userEmail: string): string {
    const hasher = crypto.createHmac(
      'sha256',
      this.envService.config.awsCognitoClientSecret,
    );
    hasher.update(userEmail + this.envService.config.awsCognitoClientId);
    return hasher.digest('base64');
  }

  async verifyRefreshToken(refreshToken: string): Promise<JwtTokenPayload> {
    try {
      const jwtTokenPayload = await Promise.resolve({
        userId: `Fake user id: ${refreshToken}`,
      });
      // await this.jwtService.verifyAsync<JwtTokenPayload>(refreshToken, {
      //   secret: MOCK_JWT_SECRET,
      // });

      return jwtTokenPayload;
    } catch {
      throw new Error('Refresh token invalid');
    }
  }
}
