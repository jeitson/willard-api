// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			signOptions: {
				expiresIn: '1d',
			},
		}),
	],
	providers: [JwtStrategy],
	exports: [PassportModule, JwtModule],
})
export class AuthModule { }
