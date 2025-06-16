import { ApiProperty } from "@nestjs/swagger";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, Validate, IsDateString, IsInt } from "class-validator";

@ValidatorConstraint({ name: 'IsEndDateAfterOrEqualStartDate', async: false })
class IsEndDateAfterOrEqualStartDateConstraint implements ValidatorConstraintInterface {
	validate(endDate: string, args: ValidationArguments) {
		const object: any = args.object;
		if (!object.startDate || !endDate) return true;
		// Validar formato de fecha ISO 8601
		if (isNaN(Date.parse(endDate)) || isNaN(Date.parse(object.startDate))) return false;
		return new Date(endDate) >= new Date(object.startDate);
	}
	defaultMessage(args: ValidationArguments) {
		return 'La fecha final debe ser mayor o igual a la fecha de inicio y ambas deben tener formato de fecha válido (YYYY-MM-DD).';
	}
}

export class ReportQueryDto {
	@ApiProperty({ description: 'Fecha de inicio (YYYY-MM-DD)' })
	@IsDateString({}, { message: 'La fecha de inicio debe tener formato válido (YYYY-MM-DD).' })
	startDate: string;

	@ApiProperty({ description: 'Fecha final (YYYY-MM-DD)' })
	@IsDateString({}, { message: 'La fecha final debe tener formato válido (YYYY-MM-DD).' })
	@Validate(IsEndDateAfterOrEqualStartDateConstraint)
	endDate: string;

	@ApiProperty({ description: 'ID de la sede de acopio' })
	@IsInt({ message: 'El ID de la sede de acopio debe ser un número entero.' })
	agencyId: number;
}

export class ReportDetailResponseDto {
	@ApiProperty({ description: 'Nombre del producto' })
	name: string

	@ApiProperty({ description: 'Cantidad' })
	quantity: string

	@ApiProperty({ description: 'Unidad de medida' })
	unity: string
}

export class ReportResponseDto {
	@ApiProperty({ description: 'ID de la entrega' })
	id: number;

	@ApiProperty({ description: 'Fecha de entrega' })
	delivery_date: string;

	@ApiProperty({ description: 'Cantidad de baterías' })
	quantity_batteries: number;

	@ApiProperty({ description: 'Materiales', type: [ReportDetailResponseDto] })
	materials: ReportDetailResponseDto[];
}
