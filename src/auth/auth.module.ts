import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthAccessTokenStrategy } from './auth.strategy';
import { AuthAccessTokenGuard } from './auth.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthAccessTokenGuard, AuthAccessTokenStrategy],
})
export class AuthModule {}
