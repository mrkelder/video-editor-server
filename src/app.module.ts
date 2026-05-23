import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SignUpController } from './sign-up/sign-up.controller';
import { SignUpService } from './sign-up/sign-up.service';

@Module({
  imports: [],
  controllers: [AppController, SignUpController],
  providers: [AppService, SignUpService],
})
export class AppModule {}
