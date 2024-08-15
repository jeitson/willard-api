import { Injectable } from '@nestjs/common';
import {
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	registerDecorator,
} from 'class-validator';
import { DataSource, ObjectType, Repository } from 'typeorm';

/**
 * Validador de constraint para verificar la existencia de un valor en una tabla de datos de TypeORM
 */
@ValidatorConstraint({ name: 'entityItemExist', async: true })
@Injectable()
export class EntityExistConstraint implements ValidatorConstraintInterface {
	constructor(private dataSource: DataSource) {}

	async validate(value: string, args: ValidationArguments) {
		let repo: Repository<any>;

		if (!value) return true; // Si el valor es nulo o vacío, la validación es exitosa

		let field = 'id'; // Por defecto, el campo de comparación es 'id'

		if ('entity' in args.constraints[0]) {
			// Si se pasó un objeto de condición, se puede especificar el campo de comparación
			field = args.constraints[0].field ?? 'id';
			repo = this.dataSource.getRepository(args.constraints[0].entity);
		} else {
			// Si se pasó directamente una clase de entidad
			repo = this.dataSource.getRepository(args.constraints[0]);
		}

		// Verifica si existe un registro con el valor dado en el campo especificado
		const item = await repo.findOne({ where: { [field]: value } });
		return !!item; // Devuelve true si se encontró el registro, de lo contrario false
	}

	defaultMessage(args: ValidationArguments) {
		if (!args.constraints[0]) return '¡No se ha especificado la entidad!';

		return `Todos los registros de ${args.constraints[0].name} deben existir en la base de datos.`;
	}
}

/**
 * Decorador para validar la existencia de un valor en una tabla de datos de TypeORM
 * @param entity Clase de entidad de TypeORM o objeto de condición de validación
 * @param validationOptions Opciones de validación
 */
function IsEntityExist(
	entity: ObjectType<any> | { entity: ObjectType<any>; field?: string },
	validationOptions?: ValidationOptions,
): (object: Record<string, any>, propertyName: string) => void {
	return (object: Record<string, any>, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName,
			options: validationOptions,
			constraints: [entity],
			validator: EntityExistConstraint, // Asigna el validador EntityExistConstraint al decorador
		});
	};
}

export { IsEntityExist };
