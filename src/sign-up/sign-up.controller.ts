import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './sign-up.dto';
import type { CreateUserResponse } from './sign-up.types';
import type { Response } from 'express';
import { SignUpService } from './sign-up.service';

@Controller('sign-up')
export class SignUpController {
  constructor(private signUpService: SignUpService) {}

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
