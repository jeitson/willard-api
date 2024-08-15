import { CatalogsService } from './catalogs.service';
import { ChildDto, ChildSearchDto, ChildUpdateDto } from './dto/child.dto';
import { Child } from './entities/child.entity';
export declare class CatalogsController {
    private readonly catalogsService;
    constructor(catalogsService: CatalogsService);
    create(dto: ChildDto): Promise<void>;
    update(id: string, updateChildDto: ChildUpdateDto): Promise<Child>;
    changeOrder(id: string, order: number): Promise<Child>;
    changeParent(id: string, parentId: string): Promise<Child>;
    changeStatus(id: string): Promise<Child>;
    delete(id: string): Promise<void>;
    getById(id: string): Promise<Child>;
    getByKey(key: string): Promise<Child[]>;
    getByKeyAndParentId(key: string, id: string): Promise<Child[]>;
    searchByKeys({ keys }: ChildSearchDto): Promise<Child[]>;
}
