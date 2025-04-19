import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Auth, AuthDocument } from '../database/schema/auth.schema';
import { AccessTokenPayload } from '../common/types/jwt.type';
import { ConfigService } from 'src/config/config.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Schemas } from 'src/database/schema';
import { encryptAES, generateRSAKeyPair } from 'src/common/utils/crypto-helper';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(Schemas.Auth.name) private readonly authModel: Model<Auth>,
  ) {}

  // username(ID)과 password를 기반으로 유효한 계정을 찾고 비밀번호를 해시로 검증하는 메서드
  public async getAccount(
    username: string,
    password: string,
  ): Promise<AuthDocument | null> {
    // username으로 유저를 찾음
    const user = await this.authModel.findOne({ username }).exec();

    if (!user) {
      return null; // 유저가 존재하지 않으면 null 반환
    }

    // bcrypt를 사용하여 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null; // 비밀번호가 일치하지 않으면 null 반환
    }

    return user; // 비밀번호가 일치하면 유저 반환
  }

  // 회원가입 메서드
  public async createAccount(
    username: string, // 아이디 (username)
    password: string, // 비밀번호
    nickname: string, // 닉네임
  ): Promise<AuthDocument | null> {
    // 아이디 중복 검사
    const existingUser = await this.authModel.findOne({ username }).exec();
    if (existingUser) {
      throw new Error('아이디가 이미 존재합니다.'); // 이미 존재하는 아이디일 경우 예외 처리
    }

    // 비밀번호 해시 생성
    const hashedPassword = await bcrypt.hash(password, 10); // bcrypt로 비밀번호 해시화

    // 공개키 개인키 생성
    const { publicKey, privateKey } = generateRSAKeyPair();

    // 개인키를 대칭키로 암호화
    const encryptedPrivateKey = encryptAES(password, privateKey);

    // 새 사용자 객체 생성
    const newUser = new this.authModel({
      username,
      password: hashedPassword,
      nickname,
      publicKey,
      encryptedPrivateKey,
    });

    // 데이터베이스에 저장
    await newUser.save();

    return newUser;
  }

  // JWT Access Token 생성
  public async createAccessToken(payload: AccessTokenPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.config.SECRET_TOKEN,
    });
  }
}
