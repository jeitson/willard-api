import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReportQueryDto, ReportResponseDto } from './dto/report.dto';
import { Public } from 'src/core/common/decorators/public.decorator';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';

@ApiTags('Negocio - Reportes')
@Controller('reports')
@Public()
export class ReportsController {
	constructor(private readonly reportsService: ReportsService) { }

	@Get('battery-recycling')
	@ApiOperation({ summary: 'Reporte de Reciclaje de Baterías' })
	@ApiResult({ type: [ReportResponseDto] })
	async findAll(@Query() query: ReportQueryDto): Promise<ReportResponseDto[]> {
		return this.reportsService.getBatteryRecyclingByDate(query);
	}

	@Post('generate')
	@ApiOperation({ summary: 'Reporte de Reciclaje de Baterías' })
	@ApiResult({ type: String })
	async generate(@Body() query: ReportQueryDto): Promise<void> {
		await this.reportsService.generate(query);
	}
}
