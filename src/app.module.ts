import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SignUpController } from './sign-up/sign-up.controller';

@Module({
  imports: [],
  controllers: [AppController, SignUpController],
  providers: [AppService],
})
export class AppModule {}
