import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtkuService {
    constructor(private readonly jwt: JwtService) { }

    async parseJwt(token): Promise<any> {
        try {
            const parse = await this.jwt.verify(token)
            return parse
        } catch (err) {
            console.error(err.message);
        }
    }
}
