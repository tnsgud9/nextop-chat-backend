import { Global, Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigService as NestConfigService,
} from '@nestjs/config';
import { ConfigService } from './config.service';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true, // 전역으로 설정
      envFilePath: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
    }),
  ],
  providers: [
    {
      provide: ConfigService,
      useFactory: (nestConfigService: NestConfigService) =>
        new ConfigService(nestConfigService),
      inject: [NestConfigService],
    },
  ],
  exports: [ConfigService], // 다른 모듈에서 사용할 수 있도록 export
})
export class ConfigModule {}
