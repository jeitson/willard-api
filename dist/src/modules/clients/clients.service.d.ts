import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { ClientCreateDto, ClientQueryDto, ClientUpdateDto } from './dto/client.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
export declare class ClientsService {
    private readonly clientsRepository;
    constructor(clientsRepository: Repository<Client>);
    create(clientCreateDto: ClientCreateDto): Promise<Client>;
    update(id: number, clientUpdateDto: ClientUpdateDto): Promise<Client>;
    findAll({ page, pageSize, name }: ClientQueryDto): Promise<Pagination<Client>>;
    findOne(id: number): Promise<Client>;
    changeStatus(id: number, status: boolean): Promise<Client>;
    remove(id: number): Promise<void>;
}
