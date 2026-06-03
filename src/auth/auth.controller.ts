import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import type { CreateUserResponse } from './auth.types';
import type { Response } from 'express';
import { AuthService } from './services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(200)
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<CreateUserResponse> {
    const { userName } = createUserDto;
    const doesUserExist = await this.authService.doesUserExist(userName);

    if (doesUserExist) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    await this.authService.addUser(createUserDto);

    const { accessToken, refreshToken } =
      await this.authService.getTokenCombination();

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // TODO: add IS_PRODUCTION env variable
      sameSite: true,
    });

    return { accessToken };
  }
}
