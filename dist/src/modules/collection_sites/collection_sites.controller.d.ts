import { CollectionSitesService } from './collection_sites.service';
import { CollectionSiteCreateDto, CollectionSiteQueryDto, CollectionSiteUpdateDto } from './dto/collection_site.dto';
import { CollectionSite } from './entities/collection_site.entity';
export declare class CollectionSitesController {
    private readonly collectionSitesService;
    constructor(collectionSitesService: CollectionSitesService);
    create(createCollectionSiteDto: CollectionSiteCreateDto): Promise<CollectionSite>;
    findAll(dto: CollectionSiteQueryDto): Promise<import("../../core/helper/paginate/pagination").Pagination<CollectionSite, import("../../core/helper/paginate/interface").IPaginationMeta>>;
    findOne(id: string): Promise<CollectionSite>;
    update(id: string, updateCollectionSiteDto: CollectionSiteUpdateDto): Promise<CollectionSite>;
    changeStatus(id: string, status: boolean): Promise<CollectionSite>;
    remove(id: string): Promise<void>;
}
