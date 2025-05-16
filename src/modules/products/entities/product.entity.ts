import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { AuditRouteDetail } from "src/modules/audit_route/entities/audit_route_detail.entity";
import { NoteCredit } from "src/modules/audit_route/entities/note_credit.entity";
import { CollectionRequest } from "src/modules/collection_request/entities/collection_request.entity";
import { ReceptionDetail } from "src/modules/receptions/entities/reception_detail.entity";
import { ReportsPh } from "src/modules/reports_ph/entities/reports_ph.entity";
import { ShipmentDetail } from "src/modules/shipments/entities/shipment_detail.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({ name: 'producto' })
export class Product extends CompleteEntity {
	@ApiProperty({ description: 'productTypeId' })
	@Column({ type: 'bigint', name: 'TipoProductoId' })
	productTypeId: number;

	@ApiProperty({ description: 'unitMeasureId' })
	@Column({ type: 'bigint', name: 'UnidadMedidaId' })
	unitMeasureId: number;

	@ApiProperty({ description: 'name' })
	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'averageKg' })
	@Column({ type: 'numeric', precision: 8, scale: 2, default: 0, name: 'KgPromedio' })
	averageKg: string;

	@ApiProperty({ description: 'recoveryPercentage' })
	@Column({ type: 'numeric', precision: 8, scale: 2, default: 0, name: 'PorcentajeRecuperacion' })
	recoveryPercentage: string;

	@ApiProperty({ description: 'isCertifiable' })
	@Column({ type: 'boolean', default: false, name: 'EsCertificable' })
	isCertifiable: boolean;

	@ApiProperty({ description: 'reference1' })
	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Referencia1' })
	reference1: string;

	@ApiProperty({ description: 'reference2' })
	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Referencia2' })
	reference2: string;

	@ApiProperty({ description: 'reference3' })
	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Referencia3' })
	reference3: string;

	@ApiProperty({ description: 'description' })
	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Descripcion' })
	description: string;

	@ApiProperty({ description: 'referenceWLL' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaWLL' })
	referenceWLL: string;

	@ApiProperty({ description: 'referencePH' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaPH' })
	referencePH: string;

	// @OneToMany(() => CollectionRequest, (collectionRequests) => collectionRequests.product)
	// collectionRequests: CollectionRequest[];

	@OneToMany(() => ReceptionDetail, (receptionDetail) => receptionDetail.product)
	receptionDetails: ReceptionDetail[];

	@OneToMany(() => ShipmentDetail, (shipmentDetail) => shipmentDetail.product)
	shipmentDetails: ShipmentDetail[];

	@OneToMany(() => AuditRouteDetail, (auditRouteDetail) => auditRouteDetail.product)
	auditRouteDetails: AuditRouteDetail[];

	@OneToMany(() => NoteCredit, (noteCredit) => noteCredit.product)
	noteCredits: NoteCredit[];

	// @OneToMany(() => ReportsPh, (reportsPh) => reportsPh.product)
	reportsPh: ReportsPh[];
}
