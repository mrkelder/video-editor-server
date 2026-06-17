import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import type { Request, Response } from 'express';
import { AuthService } from './services/auth/auth.service';
import {
  CreateUserResponse,
  RefreshTokenResponse,
} from './auth.controller.types';
import { LogInUserDto } from './dto/log-in-user.dto';
import { EnvService } from 'src/services/env';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private envService: EnvService,
  ) {}

  @Post('sign-up')
  @HttpCode(200)
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<CreateUserResponse> {
    try {
      const { userName } = createUserDto;
      const doesUserExist = await this.authService.doesUserExist(userName);

      if (doesUserExist) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      const { id } = await this.authService.addUser(createUserDto);

      const { accessToken, refreshToken } =
        await this.authService.getTokenCombination(id);

      response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: this.envService.config.isProduction,
        sameSite: true,
      });

      return { accessToken };
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      else
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  @Post('log-in')
  @HttpCode(200)
  async logInUser(
    @Body() logInUserDto: LogInUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LogInUserResponse> {
    try {
      const { userName, password } = logInUserDto;
      await this.authService.verifyUserCredentials(userName, password);
      const user = await this.authService.getUserByUserName(userName);

      const { accessToken, refreshToken } =
        await this.authService.getTokenCombination(user.id);

      response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: this.envService.config.isProduction,
        sameSite: true,
      });

      return { accessToken, userName: user.userName };
    } catch {
      throw new HttpException(
        'Credentials are invalid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = request.cookies?.refreshToken as string | undefined;

      if (!refreshToken) throw new Error('Refresh token is missing');

      const { userId } =
        await this.authService.verifyRefreshToken(refreshToken);

      const user = await this.authService.getUserByUserId(userId);

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await this.authService.getTokenCombination(user.id);

      response.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: this.envService.config.isProduction,
        sameSite: true,
      });

      return { accessToken: newAccessToken };
    } catch {
      throw new HttpException(
        'Failed to refresh token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
