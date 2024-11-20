import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuditGuiaService } from './audit-guia.service';
import { CreateAuditGuiaDto } from './dto/create-audit-guia.dto';
import { UpdateAuditGuiaDto } from './dto/update-audit-guia.dto';

@Controller('audit-guia')
export class AuditGuiaController {
  constructor(private readonly auditGuiaService: AuditGuiaService) {}

  @Post()
  create(@Body() createAuditGuiaDto: CreateAuditGuiaDto) {
    return this.auditGuiaService.create(createAuditGuiaDto);
  }

  @Get()
  findAll() {
    return this.auditGuiaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditGuiaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuditGuiaDto: UpdateAuditGuiaDto) {
    return this.auditGuiaService.update(+id, updateAuditGuiaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auditGuiaService.remove(+id);
  }
}
