import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { RegistersService } from './registers.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { RegisterDto } from './dto/register.dto';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Public } from 'src/core/common/decorators/public.decorator';

@ApiTags('Negocio - Registro')
// @UseGuards(RolesGuard)
@Controller('registers')
export class RegistersController {
	constructor(private readonly registersService: RegistersService) { }

	@Post()
	@Public()
	@UseInterceptors(FileInterceptor('file'))
	async createRecord(
		@UploadedFile() file: Express.Multer.File,
		@Body() body: any
	) {
		if (file) {
			return await this.registersService.createFromExcel(file);
		}

		if (body && typeof body === 'object') {
			const jsonData = body as RegisterDto;
			return await this.registersService.createFromJson(jsonData);
		}

		throw new BusinessException('Debe proporcionar un archivo Excel o un objeto JSON válido');
	}
}
