import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductCreateDto, ProductQueryDto, ProductUpdateDto } from './dto/product.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
export declare class ProductsService {
    private readonly productsRepository;
    constructor(productsRepository: Repository<Product>);
    create(productCreateDto: ProductCreateDto): Promise<Product>;
    update(id: number, productUpdateDto: ProductUpdateDto): Promise<Product>;
    findAll({ page, pageSize, name }: ProductQueryDto): Promise<Pagination<Product>>;
    findOne(id: number): Promise<Product>;
    changeStatus(id: number, status: boolean): Promise<Product>;
    remove(id: number): Promise<void>;
}
