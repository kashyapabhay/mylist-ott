// filepath: /home/abhaykashyap/workspaces/vscodenodejs/ott-mylist-new/mylist-ott/src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: 'dfkdk3kksd453sacxa54', // Replace with your own secret
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}