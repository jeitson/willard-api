import { Controller, Get, Query } from '@nestjs/common';
import { ReportQueryDto } from './dto/reports_ph.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReportsPh } from './entities/reports_ph.entity';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { ReportsPhService } from './reports_ph.service';
import { Public } from 'src/core/common/decorators/public.decorator';

@ApiTags('Negocio - Reportes')
@Controller('reporte_ph')
export class ReportsPhController {
	constructor(private readonly reportsService: ReportsPhService) { }

	@Get()
	@Public()
	@ApiOperation({ summary: 'Obtener todos los reportes con paginación' })
	@ApiResult({ type: [ReportsPh], isPage: true })
	findAll(@Query() query: ReportQueryDto) {
		return this.reportsService.findAll(query);
	}

	@Get(':id')
	@Public()
	@ApiOperation({ summary: 'Obtener un reporte por su ID' })
	findOne(@IdParam('id') id: string): Promise<ReportsPh> {
		return this.reportsService.findOne(+id);
	}
}
