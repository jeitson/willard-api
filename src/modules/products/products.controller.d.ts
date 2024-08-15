import { ProductsService } from './products.service';
import { ProductCreateDto, ProductQueryDto, ProductUpdateDto } from './dto/product.dto';
import { Product } from './entities/product.entity';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: ProductCreateDto): Promise<Product>;
    findAll(dto: ProductQueryDto): Promise<import("../../core/helper/paginate/pagination").Pagination<Product, import("../../core/helper/paginate/interface").IPaginationMeta>>;
    findOne(id: string): Promise<Product>;
    update(id: string, updateProductDto: ProductUpdateDto): Promise<Product>;
    changeStatus(id: string, status: boolean): Promise<Product>;
    remove(id: string): Promise<void>;
}
