import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReceptionsService } from './receptions.service';
import { CreateReceptionDto } from './dto/create-reception.dto';
import { UpdateReceptionDto } from './dto/update-reception.dto';

@Controller('receptions')
export class ReceptionsController {
  constructor(private readonly receptionsService: ReceptionsService) {}

  @Post()
  create(@Body() createReceptionDto: CreateReceptionDto) {
    return this.receptionsService.create(createReceptionDto);
  }

  @Get()
  findAll() {
    return this.receptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receptionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReceptionDto: UpdateReceptionDto) {
    return this.receptionsService.update(+id, updateReceptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.receptionsService.remove(+id);
  }
}
