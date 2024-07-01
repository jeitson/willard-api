import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseArrayPipe,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { ApiSecurityAuth } from 'src/core/common/decorators/swagger.decorator';

import { UserPasswordDto } from './dto/password.dto';
import { UserDto, UserUpdateDto } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@ApiTags('Sistema - Módulo de Usuario')
@ApiSecurityAuth()
@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	@ApiOperation({ summary: 'Get list of users' })
	@ApiResult({ type: [UserEntity], isPage: true })
	async list(@Query() dto: any) {
		return this.userService.list(dto);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get user by ID' })
	async read(@IdParam() id: string) {
		return this.userService.info(id);
	}

	@Post()
	@ApiOperation({ summary: 'Create new user' })
	async create(@Body() dto: UserDto): Promise<void> {
		await this.userService.create(dto);
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update user' })
	async update(
		@IdParam() id: string,
		@Body() dto: UserUpdateDto,
	): Promise<void> {
		await this.userService.update(id, dto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete user' })
	@ApiParam({
		name: 'id',
		type: String,
		schema: { oneOf: [{ type: 'string' }, { type: 'number' }] },
	})
	async delete(
		@Param('id', new ParseArrayPipe({ items: Number, separator: ',' }))
		ids: string[],
	): Promise<void> {
		await this.userService.delete(ids);
		await this.userService.multiForbidden(ids);
	}

	@Post(':id/password')
	@ApiOperation({ summary: 'Change user password' })
	async password(
		@IdParam() id: string,
		@Body() dto: UserPasswordDto,
	): Promise<void> {
		await this.userService.forceUpdatePassword(id, dto.password);
	}
}
