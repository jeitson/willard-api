import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { Reception } from "./reception.entity";
import { CompleteEntity } from "src/core/common/entity/common.entity";

@Entity({ name: 'recepcion_foto' })
export class ReceptionPhoto extends CompleteEntity {
	@ApiProperty({ description: 'ID de recepción (FK)' })
	@ManyToOne(() => Reception, (reception) => reception.receptionPhotos)
	@JoinColumn({ name: 'RecepcionId' })
	reception: Reception;

	@ApiProperty({ description: 'URL de la foto' })
	@Column({ type: 'varchar', length: 255, name: 'Url' })
	url: string;
}
