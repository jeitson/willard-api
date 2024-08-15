import { Injectable } from '@nestjs/common';
import {
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	registerDecorator,
} from 'class-validator';
import { isNil, merge } from 'lodash';
import { DataSource, ObjectType } from 'typeorm';

// Interfaz que define la condición de validación de unicidad
interface Condition {
	entity: ObjectType<any>; // Tipo de entidad de TypeORM
	field?: string; // Campo a verificar para unicidad
}

/**
 * Validador de constraint para verificar la unicidad de un campo en una entidad de TypeORM
 */
@ValidatorConstraint({ name: 'entityItemUnique', async: true })
@Injectable()
export class UniqueConstraint implements ValidatorConstraintInterface {
	constructor(private dataSource: DataSource) {}

	async validate(value: any, args: ValidationArguments) {
		// Obtener la configuración de validación
		const config: Omit<Condition, 'entity'> = {
			field: args.property,
		};
		const condition = ('entity' in args.constraints[0]
			? merge(config, args.constraints[0])
			: {
					...config,
					entity: args.constraints[0],
				}) as unknown as Required<Condition>;
		if (!condition.entity) return false;
		try {
			// Verificar si ya existe un registro con el valor proporcionado en el campo especificado
			const repo = this.dataSource.getRepository(condition.entity);
			return isNil(
				await repo.findOne({
					where: { [condition.field]: value },
				}),
			);
		} catch (err) {
			// En caso de error al consultar la base de datos, la validación falla
			return false;
		}
	}

	defaultMessage(args: ValidationArguments) {
		const { entity, property } = args.constraints[0];
		const queryProperty = property ?? args.property;
		if (!(args.object as any).getManager)
			return '¡No se ha encontrado la función getManager!';

		if (!entity) return '¡No se ha especificado la entidad!';

		return `${queryProperty} de ${entity.name} debe ser único.`;
	}
}

/**
 * Decorador para validar la unicidad de un campo en una entidad de TypeORM
 * @param entity Clase de entidad de TypeORM o objeto de condición de validación
 * @param validationOptions Opciones de validación
 */
function IsUnique(
	entity: ObjectType<any> | Condition,
	validationOptions?: ValidationOptions,
): (object: Record<string, any>, propertyName: string) => void {
	return (object: Record<string, any>, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName,
			options: validationOptions,
			constraints: [entity],
			validator: UniqueConstraint, // Asigna el validador UniqueConstraint al decorador
		});
	};
}

export { IsUnique };
