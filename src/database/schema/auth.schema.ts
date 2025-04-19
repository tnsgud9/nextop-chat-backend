import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Permission } from 'src/common/enums/permission.enum';

// 'Auth' 모델의 문서 타입을 정의
export type AuthDocument = HydratedDocument<Auth>;

// Auth 스키마 정의
@Schema({ timestamps: true, versionKey: false })
export class Auth {
  // 필수, 고유한 사용자명
  @Prop({ required: true, unique: true })
  username: string;

  // 필수 비밀번호
  @Prop({ required: true })
  password: string;

  // 필수, 권한 열거형 (기본값: USER)
  @Prop({
    required: true,
    type: String,
    enum: Permission,
    default: Permission.USER,
  })
  permission: Permission;

  // 닉네임
  @Prop({ required: true })
  nickname: string;

  // 공개키
  @Prop({ required: true })
  publicKey: string;

  // 암호화된 비공개키
  @Prop({ required: true })
  encryptedPrivateKey: string;
}

// Auth 클래스를 바탕으로 Mongoose 스키마를 생성
export const AuthSchema = SchemaFactory.createForClass(Auth);
