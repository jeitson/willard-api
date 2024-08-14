import { Repository } from 'typeorm';
import { CollectionSite } from './entities/collection_site.entity';
import { CollectionSiteCreateDto, CollectionSiteQueryDto, CollectionSiteUpdateDto } from './dto/collection_site.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
export declare class CollectionSitesService {
    private collectionSiteRepository;
    constructor(collectionSiteRepository: Repository<CollectionSite>);
    create(createCollectionSiteDto: CollectionSiteCreateDto): Promise<CollectionSite>;
    findAll({ page, pageSize, name }: CollectionSiteQueryDto): Promise<Pagination<CollectionSite>>;
    findOne(id: number): Promise<CollectionSite>;
    update(id: number, updateCollectionSiteDto: CollectionSiteUpdateDto): Promise<CollectionSite>;
    changeStatus(id: number, status: boolean): Promise<CollectionSite>;
    remove(id: number): Promise<void>;
}
