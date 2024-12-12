import { Injectable } from '@nestjs/common';
import { CreateReportsPhDto } from './dto/create-reports_ph.dto';
import { UpdateReportsPhDto } from './dto/update-reports_ph.dto';

@Injectable()
export class ReportsPhService {
  create(createReportsPhDto: CreateReportsPhDto) {
    return 'This action adds a new reportsPh';
  }

  findAll() {
    return `This action returns all reportsPh`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reportsPh`;
  }

  update(id: number, updateReportsPhDto: UpdateReportsPhDto) {
    return `This action updates a #${id} reportsPh`;
  }

  remove(id: number) {
    return `This action removes a #${id} reportsPh`;
  }
}
