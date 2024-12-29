// filepath: /home/abhaykashyap/workspaces/vscodenodejs/ott-mylist-new/mylist-ott/src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) { }

    async validateUser(token: string): Promise<any> {

        if (token === 'may-the-force-be-with-you') {
            return { userId: "testUserId", username: "testUsername" };
        }
        return this.jwtService.verify(token);

    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async logout() {

        //TODO: Implement logout logic
    }
}