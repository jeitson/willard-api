import { Controller, Post, Body, UseInterceptors, UploadedFile, Get, Query, Patch, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Public } from 'src/core/common/decorators/public.decorator';
import { TransporterTravelService } from './transporter_travel.service';
import { TransporterTravelDto, TransporterTravelRouteIdDto } from './dto/transporter_travel.dto';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { ResponseCodeTransporterTravel } from './entities/response';
import { Roles } from 'src/core/common/decorators/role.decorator';
import { TransporterTravel } from './entities/transporter_travel.entity';
import { ROL } from 'src/core/constants/rol.constant';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';

@ApiTags('Negocio - Transportadora Viaje')
// @UseGuards(RolesGuard)
@Controller('registro')
export class TransporterTravelController {
	constructor(private readonly transporterTravelService: TransporterTravelService) { }

	@Post()
	@Public()
	@UseInterceptors(FileInterceptor('file'))
	@ApiResult({ type: [ResponseCodeTransporterTravel] })
	async createRecord(
		@UploadedFile() file: any,
		@Body() body: any
	): Promise<ResponseCodeTransporterTravel[]> {
		if (file) {
			return await this.transporterTravelService.createFromExcel(file);
		}

		if (body && typeof body === 'object') {
			const jsonData = body as TransporterTravelDto;
			return await this.transporterTravelService.createFromJson(jsonData);
		}

		throw new BusinessException('Debe proporcionar un archivo Excel o un objeto JSON válido');
	}

	@Get()
	@Roles(ROL.AUDITORIA_PH)
	@Public()
	@ApiOperation({ summary: 'Listado de registros de transportadora' })
	@ApiResult({ type: [TransporterTravel] })
	async findAll(@Query() query: any) {
		return this.transporterTravelService.findAll(query);
	}

	@Patch('route/:id')
	@Roles(ROL.AUDITORIA_PH)
	@ApiOperation({ summary: 'Actualizar número de ruta por su por ID' })
	async updateRouteId(
		@IdParam('id') id: number,
		@Body() detailsToUpdate: TransporterTravelRouteIdDto,
	): Promise<void> {
		await this.transporterTravelService.updateRouteId(id, detailsToUpdate);
	}
}
