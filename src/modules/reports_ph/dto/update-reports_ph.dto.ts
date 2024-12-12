import { PartialType } from '@nestjs/swagger';
import { CreateReportsPhDto } from './create-reports_ph.dto';

export class UpdateReportsPhDto extends PartialType(CreateReportsPhDto) {}
