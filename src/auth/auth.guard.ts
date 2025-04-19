import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthAccessTokenGuard extends AuthGuard('access_token') {}
