import { Controller, Body, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/common/decorators/role.decorator';
import { DriversService } from './drivers.service';
import { DriverUpdateDto } from './dto/driver.dto';
import { Driver } from 'typeorm';
import { ROL } from 'src/core/constants/rol.constant';

@ApiTags('Negocio - Conductor')
@UseGuards(RolesGuard)
@Controller('collection-request/:id/drivers')
export class DriversController {
	constructor(private readonly driversServices: DriversService) { }

	@Put(':id')
	@Roles(ROL.ADMINISTRATOR)
	@ApiOperation({ summary: 'Actualización de conductor' })
	create(@IdParam('id') id: string, @Body() createDto: DriverUpdateDto): Promise<Driver> {
		return this.driversServices.update(+id, createDto);
	}
}
