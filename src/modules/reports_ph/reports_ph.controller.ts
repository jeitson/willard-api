import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportsPhService } from './reports_ph.service';
import { CreateReportsPhDto } from './dto/create-reports_ph.dto';
import { UpdateReportsPhDto } from './dto/update-reports_ph.dto';

@Controller('reports-ph')
export class ReportsPhController {
  constructor(private readonly reportsPhService: ReportsPhService) {}

  @Post()
  create(@Body() createReportsPhDto: CreateReportsPhDto) {
    return this.reportsPhService.create(createReportsPhDto);
  }

  @Get()
  findAll() {
    return this.reportsPhService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsPhService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportsPhDto: UpdateReportsPhDto) {
    return this.reportsPhService.update(+id, updateReportsPhDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsPhService.remove(+id);
  }
}
