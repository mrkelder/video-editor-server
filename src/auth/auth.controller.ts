import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './auth.dto';
import type { CreateUserResponse } from './auth.types';
import type { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private signUpService: AuthService) {}

  @Post()
  @HttpCode(200)
  createUser(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): CreateUserResponse {
    const { accessToken, refreshToken } =
      this.signUpService.getTokenCombination();

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // TODO: add IS_PRODUCTION env variable
      sameSite: true,
    });
    return { accessToken };
  }
}
