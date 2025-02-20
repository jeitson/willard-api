import { Controller, Get } from '@nestjs/common';
import { ConciliationService } from './conciliation.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { Conciliation } from './entities/conciliation.entity';
import { Public } from 'src/core/common/decorators/public.decorator';

@ApiTags('Sistema - Conciliación')
// @UseGuards(RolesGuard)
@Controller('conciliation')
export class ConciliationController {
	constructor(private readonly conciliationService: ConciliationService) { }

	@Get()
	// @Roles(ROL.AGENCIA_PH, ROL.RECUPERADORA)
	@Public()
	@ApiOperation({ summary: 'Obtener listado - Paginación' })
	@ApiResult({ type: [Conciliation], isPage: true })
	findAll() {
		return this.conciliationService.findAll();
	}
}
