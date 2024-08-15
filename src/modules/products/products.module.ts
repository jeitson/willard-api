import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

const providers = [ProductsService]

@Module({
	imports: [TypeOrmModule.forFeature([Product])],
	controllers: [ProductsController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class ProductsModule {}
