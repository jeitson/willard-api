import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { User } from './entities/user.entity';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { UserDto, UserOAuthDto, UserQueryDto, UserUpdateDto } from './dto/user.dto';

@ApiTags('Sistema - Usuarios')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Get()
	@ApiOperation({ summary: 'Obtener listado de todos los usuarios - Paginación' })
	@ApiResult({ type: [User], isPage: true })
	async findAll(@Query() dto: UserQueryDto) {
		return this.usersService.findAll(dto);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obtener usuario por su ID' })
	@ApiResult({ type: User })
	async findOneById(@IdParam() id: string) {
		return this.usersService.findUserById(id);
	}

	@Post()
	@ApiOperation({ summary: 'Crear usuario' })
	async create(@Body() dto: UserDto): Promise<void> {
		await this.usersService.create(dto);
	}

	@Post('oauth')
	@ApiOperation({ summary: 'Crear usuario por medio de OAuth0' })
	async createByOAuth0(@Body() dto: UserOAuthDto): Promise<void> {
		await this.usersService.createByOAuth0(dto);
	}

	@Put(':id')
	@ApiOperation({ summary: 'Actualizar usuario' })
	async update(
		@IdParam() id: string,
		@Body() dto: UserUpdateDto,
	): Promise<void> {
		await this.usersService.update(id, dto);
	}

	@Post(':id/role/:rol_id')
	@ApiOperation({ summary: 'Asignar role a usuario' })
	async addRolToUser(@IdParam('id') id: string, @IdParam('rol_id') rol_id: string): Promise<void> {
		await this.usersService.addRolToUser(+id, +rol_id);
	}
}
