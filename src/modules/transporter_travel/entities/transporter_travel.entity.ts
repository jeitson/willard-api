import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CompleteEntity } from 'src/core/common/entity/common.entity';
import { TransporterTravelDetail } from './transporter_travel_detail.entity';
import { AuditRoute } from 'src/modules/audit_route/entities/audit_route.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'transportadora_viaje' })
export class TransporterTravel extends CompleteEntity {
	@ApiProperty({ description: 'Número de Ruta' })
	@Column({ type: 'varchar', length: 20, name: 'RutaId' })
	routeId: string;

	@Column({ type: 'varchar', length: 20, name: 'IdGuia' })
	guideId: string;

	@Column({ type: 'varchar', name: 'Tipo' })
	type: string;  // RECOGIDA, ENTREGA o TRANSBORDO

	@Column({ type: 'int', name: 'Secuencia' })
	sequence: number;

	@Column({ type: 'date', name: 'FechaMov' })
	movementDate: string;

	@Column({ type: 'time', name: 'HoraMov' })
	movementTime: string;

	@Column({ type: 'int', name: 'Planeador' })
	planner: number;

	@Column({ type: 'varchar', length: 50, name: 'Zona' })
	zone: string;

	@Column({ type: 'varchar', length: 50, name: 'Ciudad' })
	city: string;

	@Column({ type: 'varchar', length: 50, name: 'Depto' })
	department: string;

	@Column({ type: 'varchar', length: 10, name: 'Placa' })
	licensePlate: string;

	@Column({ type: 'varchar', length: 100, name: 'Conductor' })
	driver: string;

	@Column({ type: 'varchar', length: 100, name: 'NombreSitio' })
	siteName: string;

	@Column({ type: 'varchar', length: 100, name: 'Direccion' })
	address: string;

	@Column({ type: 'varchar', length: 20, name: 'PosGps' })
	gpsPosition: string;

	@Column({ type: 'int', name: 'TotCant' })
	totalQuantity: number;

	@Column({ type: 'varchar', length: 50, name: 'DocReferencia' })
	referenceDocument: string;

	@Column({ type: 'varchar', length: 50, nullable: true, name: 'DocReferencia2' })
	referenceDocument2: string;

	@Column({ type: 'simple-array', name: 'UrlSoportes' })
	supportUrls: string[];

	@OneToMany(() => TransporterTravelDetail, detail => detail.travelRecord, { cascade: true })
	details: TransporterTravelDetail[];

	@OneToMany(() => AuditRoute, (auditRoute) => auditRoute.transporterTravel)
	auditRoutes: AuditRoute[];
}
