import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Client } from "src/modules/clients/entities/client.entity";
import { CollectionSite } from "src/modules/collection_sites/entities/collection_site.entity";
import { Product } from "src/modules/products/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: 'reporte_ph' })
export class ReportsPh extends CompleteEntity {
	@ApiProperty({ description: 'ID del cliente' })
	@ManyToOne(() => Client, (client) => client.reportsPh)
	@JoinColumn({ name: 'ClienteId' })
	client: Client;

	@ApiProperty({ description: 'Número de guía' })
	@Column({ type: 'varchar', length: 20, name: 'NumeroGuia' })
	guideNumber: string;

	@ApiProperty({ description: 'ID del producto' })
	@ManyToOne(() => Product, (product) => product.reportsPh)
	@JoinColumn({ name: 'ProductoId' })
	product: Product;

	@ApiProperty({ description: 'Fecha' })
	@Column({ type: 'varchar', length: 20, name: 'Fecha', nullable: true })
	date: string;

	@ApiProperty({ description: 'Cantidad' })
	@Column({ type: 'int', name: 'Cantidad' })
	quantityProduct: number;

	@ApiProperty({ description: 'Consultado' })
	@Column({ type: 'boolean', name: 'Consultado', nullable: true, default: null })
	consulted: boolean;

	// @ApiProperty({ description: 'ID de la sede de acopio' })
	// @ManyToOne(() => CollectionSite, (collectionSite) => collectionSite.reportsPh)
	// @JoinColumn({ name: 'SedeAcopioId' })
	// collectionSite: CollectionSite;
}

