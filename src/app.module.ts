import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/services/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from './services/env';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, JwtService, EnvService],
})
export class AppModule {}
