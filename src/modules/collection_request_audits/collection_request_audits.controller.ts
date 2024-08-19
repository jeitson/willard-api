import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CollectionRequestAuditsService } from './collection_request_audits.service';
import { CollectionRequestAuditCreateDto, CollectionRequestAuditUpdateDto } from './dto/collection_request_audit.dto';
import { CollectionRequestAudit } from './entities/collection_request_audit.entity';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';

@ApiTags('Auditoría de Solicitudes de Recogida')
@Controller('collection-request-audits')
export class CollectionRequestAuditsController {
  constructor(private readonly service: CollectionRequestAuditsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear auditoría de solicitud de recogida' })
  create(@Body() dto: CollectionRequestAuditCreateDto): Promise<CollectionRequestAudit> {
    return this.service.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener auditoría de solicitud de recogida por ID' })
  findOne(@IdParam('id') id: number): Promise<CollectionRequestAudit> {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar auditoría de solicitud de recogida' })
  update(@IdParam('id') id: number, @Body() dto: CollectionRequestAuditUpdateDto): Promise<CollectionRequestAudit> {
    return this.service.update(id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener listado de auditorías de solicitudes de recogida' })
  findAll(@Query() query): Promise<CollectionRequestAudit[]> {
    return this.service.findAll(query);
  }
}
