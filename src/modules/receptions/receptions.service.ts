import { Injectable } from '@nestjs/common';
import { CreateReceptionDto } from './dto/create-reception.dto';
import { UpdateReceptionDto } from './dto/update-reception.dto';

@Injectable()
export class ReceptionsService {
  create(createReceptionDto: CreateReceptionDto) {
    return 'This action adds a new reception';
  }

  findAll() {
    return `This action returns all receptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reception`;
  }

  update(id: number, updateReceptionDto: UpdateReceptionDto) {
    return `This action updates a #${id} reception`;
  }

  remove(id: number) {
    return `This action removes a #${id} reception`;
  }
}
