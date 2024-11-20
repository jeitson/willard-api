import { Injectable } from '@nestjs/common';
import { CreateAuditGuiaDto } from './dto/create-audit_guia.dto';
import { UpdateAuditGuiaDto } from './dto/update-audit_guia.dto';

@Injectable()
export class AuditGuiaService {
  create(createAuditGuiaDto: CreateAuditGuiaDto) {
    return 'This action adds a new auditGuia';
  }

  findAll() {
    return `This action returns all auditGuia`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auditGuia`;
  }

  update(id: number, updateAuditGuiaDto: UpdateAuditGuiaDto) {
    return `This action updates a #${id} auditGuia`;
  }

  remove(id: number) {
    return `This action removes a #${id} auditGuia`;
  }
}
