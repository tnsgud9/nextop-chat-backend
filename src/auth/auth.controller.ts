import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  AuthLoginRequestDto,
  AuthLoginResponseDto,
  AuthSignupRequestDto,
  AuthSignupResponseDto,
} from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // 로그인 API
  @Post('login')
  async authLogin(
    @Body() authLoginDto: AuthLoginRequestDto,
    @Res({ passthrough: true }) res: Response, // passthrough는 NestJS의 자동 응답 처리를 유지하면서 Response 객체를 사용할 수 있도록 해주는 기능
  ): Promise<AuthLoginResponseDto> {
    const { username, password } = authLoginDto;

    const authEntity = await this.authService.getAccount(username, password);
    if (!authEntity) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 잘못되었습니다.');
    }
    const { nickname, publicKey, encryptedPrivateKey } = authEntity;

    const accessToken = await this.authService.createAccessToken({
      id: authEntity.id,
      nickname: authEntity.nickname,
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true, // XSS 공격 방지
      secure: true, // HTTPS 환경에서만 전송 (개발 환경에서는 false 가능)
      sameSite: 'strict', // CSRF 방지
    });

    return {
      accessToken,
      nickname,
      publicKey,
      encryptedPrivateKey,
      id: authEntity.id,
    };
  }

  @Post('signup')
  async authSignup(
    @Body() authSignupDto: AuthSignupRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthSignupResponseDto> {
    const { username, password, nickname } = authSignupDto;

    const existingUser = await this.authService.getAccount(username, password);
    if (existingUser !== null) {
      throw new ConflictException('이미 존재하는 아이디입니다.');
    }

    const newUser = await this.authService.createAccount(
      username,
      password,
      nickname,
    );
    if (!newUser) {
      throw new InternalServerErrorException('회원가입에 실패했습니다.');
    }

    const accessToken = await this.authService.createAccessToken({
      id: newUser.id,
      nickname: newUser.nickname,
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true, // XSS 공격 방지
      secure: true, // HTTPS 환경에서만 전송 (개발 환경에서는 false 가능)
      sameSite: 'strict', // CSRF 방지
    });

    return {
      accessToken,
      nickname: newUser.nickname,
      encryptedPrivateKey: newUser.encryptedPrivateKey,
      publicKey: newUser.publicKey,
    };
  }

  // 로그아웃 API
  @Get('logout')
  authLogout(@Res({ passthrough: true }) res: Response) {
    // 쿠키에 저장된 access_token 삭제
    res.clearCookie('access_token');
    return res.status(200).json({ message: '로그아웃 되었습니다.' });
  }
}
