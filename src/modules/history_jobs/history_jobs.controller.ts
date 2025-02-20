import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { HistoryJobsService } from './history_jobs.service';
import { Roles } from 'src/core/common/decorators/role.decorator';
import { ROL } from 'src/core/constants/rol.constant';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { HistoryJob } from './entities/history_job.entity';
import { HistoryJobQueryDto } from './dto/history_job.dto';
import { RolesGuard } from 'src/core/guards/roles.guard';

@ApiTags('Sistema - Procesos Asíncronos')
@Controller('history-jobs')
@UseGuards(RolesGuard)
export class HistoryJobsController {
	constructor(private readonly historyJobsService: HistoryJobsService) { }

	@Get()
	@Roles(ROL.ADMINISTRATOR)
	@ApiOperation({ summary: 'Obtener listado de historial de jobs ejecutados - Paginación' })
	@ApiResult({ type: [HistoryJob], isPage: true })
	async findAll(@Query() dto: HistoryJobQueryDto) {
		return this.historyJobsService.findAll(dto);
	}

	@Get(':id')
	@Roles(ROL.ADMINISTRATOR)
	@ApiOperation({ summary: 'Obtener historial por su ID' })
	@ApiResult({ type: HistoryJob })
	findOneById(@Param('id') id: string) {
		return this.historyJobsService.findOneById(+id);
	}
}
