import { Injectable } from '@nestjs/common';
import { Configuration } from './configuration';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  config: Configuration;
  constructor(private configService: NestConfigService) {
    this.config = {
      DB_URI: configService.get('DB_URI') || 'localhost',
      PORT: parseInt(configService.get('PORT') || '3000'),
      SECRET_TOKEN: configService.get('SECRET_TOKEN') || 'secretsecretsecret',
    } as Configuration;
  }
}
