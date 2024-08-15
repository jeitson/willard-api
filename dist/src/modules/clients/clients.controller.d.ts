import { ClientsService } from './clients.service';
import { ClientCreateDto, ClientQueryDto, ClientUpdateDto } from './dto/client.dto';
import { Client } from './entities/client.entity';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(createClientDto: ClientCreateDto): Promise<Client>;
    findAll(dto: ClientQueryDto): Promise<import("../../core/helper/paginate/pagination").Pagination<Client, import("../../core/helper/paginate/interface").IPaginationMeta>>;
    findOne(id: string): Promise<Client>;
    update(id: string, updateClientDto: ClientUpdateDto): Promise<Client>;
    changeStatus(id: string, status: boolean): Promise<Client>;
    remove(id: string): Promise<void>;
}
