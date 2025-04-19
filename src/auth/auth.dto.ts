import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Types } from 'mongoose';

export class AuthLoginRequestDto {
  @IsEmail()
  username: string;

  @IsString()
  password: string;
}

export class AuthLoginResponseDto {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsString()
  accessToken: string;

  @IsMongoId()
  id: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  publicKey: string;

  @IsNotEmpty()
  @IsString()
  encryptedPrivateKey: string;
}

export class AuthSignupRequestDto {
  @IsEmail()
  username: string;

  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  nickname: string;
}

export class AuthSignupResponseDto {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  accessToken: string;

  @IsNotEmpty()
  @IsString()
  encryptedPrivateKey: string;

  @IsNotEmpty()
  @IsString()
  publicKey: string;
}
