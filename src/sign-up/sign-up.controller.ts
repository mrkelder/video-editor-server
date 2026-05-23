import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './sign-up.dto';
import type { CreateUserResponse } from './sign-up.types';
import type { Response } from 'express';

@Controller('sign-up')
export class SignUpController {
  @Post()
  @HttpCode(200)
  createUser(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): CreateUserResponse {
    response.cookie('refreshToken', 'xxx.yyy.zzz', {
      httpOnly: true,
      secure: false, // TODO: add IS_PRODUCTION env variable
      sameSite: true,
    });
    return { accessToken: 'xxx.yyy.zzz' };
  }
}
