import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Public } from 'src/core/common/decorators/public.decorator';
import { TransporterTravelService } from './transporter_travel.service';
import { TransporterTravelDto } from './dto/transporter_travel.dto';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { ResponseCodeTransporterTravel } from './entities/response';

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
}
