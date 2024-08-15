import { TransportersService } from './transporters.service';
import { TransporterCreateDto, TransporterQueryDto, TransporterUpdateDto } from './dto/transporter.dto';
import { Transporter } from './entities/transporter.entity';
export declare class TransportersController {
    private readonly transportersService;
    constructor(transportersService: TransportersService);
    create(createTransporterDto: TransporterCreateDto): Promise<Transporter>;
    findAll(dto: TransporterQueryDto): Promise<import("../../core/helper/paginate/pagination").Pagination<Transporter, import("../../core/helper/paginate/interface").IPaginationMeta>>;
    findOne(id: string): Promise<Transporter>;
    update(id: string, updateTransporterDto: TransporterUpdateDto): Promise<Transporter>;
    changeStatus(id: string, status: boolean): Promise<Transporter>;
    remove(id: string): Promise<void>;
}
