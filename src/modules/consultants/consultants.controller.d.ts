import { ConsultantsService } from './consultants.service';
import { Consultant } from './entities/consultant.entity';
import { ConsultantCreateDto, ConsultantQueryDto, ConsultantUpdateDto } from './dto/consultant.dto';
export declare class ConsultantsController {
    private readonly consultantsService;
    constructor(consultantsService: ConsultantsService);
    create(createConsultantDto: ConsultantCreateDto): Promise<Consultant>;
    findAll(dto: ConsultantQueryDto): Promise<import("../../core/helper/paginate/pagination").Pagination<Consultant, import("../../core/helper/paginate/interface").IPaginationMeta>>;
    findOne(id: string): Promise<Consultant>;
    update(id: string, updateConsultantDto: ConsultantUpdateDto): Promise<Consultant>;
    changeStatus(id: string, status: boolean): Promise<Consultant>;
    remove(id: string): Promise<void>;
}
