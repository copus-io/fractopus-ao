import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { readFile } from 'node:fs/promises';
import { BasicStrategy as Strategy } from 'passport-http';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  async validate(username: string, password: string): Promise<boolean> {
    const rawData = await readFile('./config/config.json', 'utf8');
    const config = JSON.parse(rawData);
    const validUsername = config.admin.username;
    const validPassword = config.admin.psw;
    if (username === validUsername && password === validPassword) {
      return true;
    }
    throw new UnauthorizedException();
  }
}


@Injectable()
export class BasicAuthGuard extends AuthGuard('basic') {}