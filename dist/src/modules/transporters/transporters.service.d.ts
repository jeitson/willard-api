import { Transporter } from './entities/transporter.entity';
import { Repository } from 'typeorm';
import { TransporterCreateDto, TransporterQueryDto, TransporterUpdateDto } from './dto/transporter.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
export declare class TransportersService {
    private readonly transportersRepository;
    constructor(transportersRepository: Repository<Transporter>);
    create(transporterCreateDto: TransporterCreateDto): Promise<Transporter>;
    update(id: number, transporterUpdateDto: TransporterUpdateDto): Promise<Transporter>;
    findAll({ page, pageSize, name }: TransporterQueryDto): Promise<Pagination<Transporter>>;
    findOne(id: number): Promise<Transporter>;
    changeStatus(id: number, status: boolean): Promise<Transporter>;
    remove(id: number): Promise<void>;
}
