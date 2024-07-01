import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiResult } from 'src/core/common/decorators/api-result.decorator';

import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { LocalGuard } from './guards/local.guard';
import { LoginToken } from './models/auth.model';

@ApiTags('Autenticación - Módulo de autenticación')
@UseGuards(LocalGuard)
@Public()
@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private userService: UserService,
	) {}

	@Post('login')
	@ApiOperation({ summary: 'Iniciar sesión' })
	@ApiResult({ type: LoginToken })
	async login(
		@Body() dto: LoginDto
	): Promise<LoginToken> {
		const token = await this.authService.login(
			dto.email,
			dto.password
		);
		return { token };
	}

	@Post('register')
	@ApiOperation({ summary: 'Registrar' })
	async register(@Body() dto: RegisterDto): Promise<void> {
		await this.userService.register(dto);
	}
}
