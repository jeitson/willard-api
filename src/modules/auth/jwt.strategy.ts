// src/modules/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKeyProvider: passportJwtSecret({
				cache: true,
				rateLimit: true,
				jwksUri: `${process.env.AUTH0_DOMAIN}.well-known/jwks.json`,
			}),
			audience: process.env.AUTH0_AUDIENCE,
			issuer: process.env.AUTH0_DOMAIN,
			algorithms: ['RS256'],
		});
	}

	async validate(payload: any) {
		return payload;
	}
}
