import { SetMetadata, applyDecorators } from '@nestjs/common';
import { isPlainObject } from 'lodash';
import { PERMISSION_KEY } from '../auth.constant';

type TupleToObject<T extends string, P extends ReadonlyArray<string>> = {
	[K in Uppercase<P[number]>]: `${T}:${Lowercase<K>}`;
};
type AddPrefixToObjectValue<
	T extends string,
	P extends Record<string, string>,
> = {
	[K in keyof P]: K extends string ? `${T}:${P[K]}` : never;
};

/** Decorador para asignar permisos a un controlador o método */
export function Perm(permission: string | string[]) {
	return applyDecorators(SetMetadata(PERMISSION_KEY, permission));
}

/** Variable para almacenar todos los permisos definidos */
let permissions: string[] = [];

/**
 * Función para definir y recopilar permisos.
 * @param modulePrefix Prefijo del módulo que define los permisos.
 * @param actions Mapa de acciones o lista de acciones.
 * @returns Mapa de acciones con el prefijo del módulo.
 */
export function definePermission<
	T extends string,
	U extends Record<string, string>,
>(modulePrefix: T, actionMap: U): AddPrefixToObjectValue<T, U>;

/**
 * Función para definir y recopilar permisos.
 * @param modulePrefix Prefijo del módulo que define los permisos.
 * @param actions Lista de acciones.
 * @returns Objeto con las acciones y sus permisos completos.
 */
export function definePermission<
	T extends string,
	U extends ReadonlyArray<string>,
>(modulePrefix: T, actions: U): TupleToObject<T, U>;

export function definePermission(modulePrefix: string, actions) {
	if (isPlainObject(actions)) {
		// Iterar sobre las acciones y agregarles el prefijo del módulo
		Object.entries(actions).forEach(([key, action]) => {
			actions[key] = `${modulePrefix}:${action}`;
		});
		// Agregar todos los permisos definidos a la lista general
		permissions = [
			...new Set([...permissions, ...Object.values<string>(actions)]),
		];
		return actions;
	} else if (Array.isArray(actions)) {
		// Crear formatos completos de permisos para cada acción
		const permissionFormats = actions.map(
			(action) => `${modulePrefix}:${action}`,
		);
		// Agregar todos los permisos definidos a la lista general
		permissions = [...new Set([...permissions, ...permissionFormats])];
		// Convertir las acciones en un objeto con permisos completos
		return actions.reduce((prev, action) => {
			prev[action.toUpperCase()] = `${modulePrefix}:${action}`;
			return prev;
		}, {});
	}
}

/** Función para obtener todos los permisos definidos */
export const getDefinePermissions = () => permissions;
