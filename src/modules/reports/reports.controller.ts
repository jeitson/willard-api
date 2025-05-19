import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReportQueryDto } from './dto/report.dto';
import { Public } from 'src/core/common/decorators/public.decorator';
import { Erc } from 'src/core/entities/erc.entity';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';

@ApiTags('Negocio - Reportes')
@Controller('reports')
@Public()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('battery-recycling')
	@ApiOperation({ summary: 'Reporte de Reciclaje de Baterías' })
	@ApiResult({ type: [Erc] })
	async findAll(@Query() query: ReportQueryDto): Promise<any> {
		return this.reportsService.getBatteryRecyclingByDate(query);
	}
}
