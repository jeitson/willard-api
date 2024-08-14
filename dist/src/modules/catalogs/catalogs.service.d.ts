import { Parent } from './entities/parent.entity';
import { EntityManager, Repository } from 'typeorm';
import { Child } from './entities/child.entity';
import { ChildDto, ChildUpdateDto } from './dto/child.dto';
export declare class CatalogsService {
    private readonly parentsRepository;
    private readonly childrensRepository;
    private entityManager;
    constructor(parentsRepository: Repository<Parent>, childrensRepository: Repository<Child>, entityManager: EntityManager);
    createChild(createChildDto: ChildDto): Promise<Child>;
    updateChild(id: number, updateChildDto: ChildUpdateDto): Promise<Child>;
    changeOrder(id: number, order: number): Promise<Child>;
    changeParent(id: number, parentId: number): Promise<Child>;
    changeStatus(id: number): Promise<Child>;
    deleteChild(id: number): Promise<void>;
    getChildById(id: number): Promise<Child>;
    getChildrenByKey(key: string): Promise<Child[]>;
    getChildrenByKeyAndParent(key: string, parentId: number): Promise<Child[]>;
    getChildrenByKeys(keys: string[]): Promise<Child[]>;
}
