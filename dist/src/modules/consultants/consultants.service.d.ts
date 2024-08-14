import { Consultant } from './entities/consultant.entity';
import { Repository } from 'typeorm';
import { ConsultantCreateDto, ConsultantQueryDto, ConsultantUpdateDto } from './dto/consultant.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
export declare class ConsultantsService {
    private readonly consultantsRepository;
    constructor(consultantsRepository: Repository<Consultant>);
    create(consultantCreateDto: ConsultantCreateDto): Promise<Consultant>;
    update(id: number, consultantUpdateDto: ConsultantUpdateDto): Promise<Consultant>;
    findAll({ page, pageSize, name }: ConsultantQueryDto): Promise<Pagination<Consultant>>;
    findOne(id: number): Promise<Consultant>;
    changeStatus(id: number, status: boolean): Promise<Consultant>;
    remove(id: number): Promise<void>;
}
