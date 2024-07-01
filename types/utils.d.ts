/** Extraer el valor de retorno */
type UnboxPromise<T extends Promise<any>> =
	T extends Promise<infer U> ? U : never;

/** Conversión de tipos de unión a tipos cruzados */
declare type UnionToIntersection<U> = (
	U extends any ? (k: U) => void : never
) extends (k: infer I) => void
	? I
	: never;

/** eg: type result = StringToUnion<'abc'> Resultado: 'a'|'b'|'c' */
type StringToUnion<S extends string> = S extends `${infer S1}${infer S2}`
	? S1 | StringToUnion<S2>
	: never;

/** Sustitución de cadenas, similar al método js string replace */
type Replace<
	Str extends string,
	From extends string,
	To extends string,
> = Str extends `${infer Left}${From}${infer Right}`
	? `${Left}${To}${Right}`
	: Str;

/** Sustitución de cadenas, similar al método js string replaceAll */
type ReplaceAll<
	Str extends string,
	From extends string,
	To extends string,
> = Str extends `${infer Left}${From}${infer Right}`
	? Replace<Replace<`${Left}${To}${Right}`, From, To>, From, To>
	: Str;

/** ej: type result = CamelCase<'foo-bar-baz'>, Resultado: fooBarBaz */
type CamelCase<S extends string> = S extends `${infer S1}-${infer S2}`
	? S2 extends Capitalize<S2>
		? `${S1}-${CamelCase<S2>}`
		: `${S1}${CamelCase<Capitalize<S2>>}`
	: S;

/** eg: type result = StringToArray<'abc'>, Resultado: ['a', 'b', 'c'] */
type StringToArray<
	S extends string,
	T extends any[] = [],
> = S extends `${infer S1}${infer S2}` ? StringToArray<S2, [...T, S1]> : T;

/** `RequiredKeys` se utiliza para obtener todos los campos obligatorios, que se combinan en un tipo de unión */
type RequiredKeys<T> = {
	[P in keyof T]: T extends Record<P, T[P]> ? P : never;
}[keyof T];

/** `OptionalKeys` se utiliza para obtener todos los campos opcionales que se combinan en un tipo de unión */
type OptionalKeys<T> = {
	[P in keyof T]: object extends Pick<T, P> ? P : never;
}[keyof T];

/** `GetRequired` se utiliza para obtener un nuevo tipo consistente en todas las claves requeridas y sus tipos en un tipo */
type GetRequired<T> = {
	[P in RequiredKeys<T>]-?: T[P];
};

/** `GetOptional` se utiliza para obtener un nuevo tipo consistente en todas las claves opcionales y sus tipos en un tipo */
type GetOptional<T> = {
	[P in OptionalKeys<T>]?: T[P];
};

/**  type result1 = Includes<[1, 2, 3, 4], '4'> Resultado:  false; type result2 = Includes<[1, 2, 3, 4], 4> Resultado:  true */
type Includes<T extends any[], K> = K extends T[number] ? true : false;

/** eg:type result = MyConcat<[1, 2], [3, 4]>  Resultado: [1, 2, 3, 4] */
type MyConcat<T extends any[], U extends any[]> = [...T, ...U];
/** eg: type result1 = MyPush<[1, 2, 3], 4> Resultado: [1, 2, 3, 4] */
type MyPush<T extends any[], K> = [...T, K];
/** eg: type result3 = MyPop<[1, 2, 3]>  Resultado: [1, 2] */
type MyPop<T extends any[]> = T extends [...infer L, infer R] ? L : never; // eslint-disable-line

type PropType<T, Path extends string> = string extends Path
	? unknown
	: Path extends keyof T
		? T[Path]
		: Path extends `${infer K}.${infer R}`
			? K extends keyof T
				? PropType<T[K], R>
				: unknown
			: unknown;

/**
 * NestedKeyOf
 * Get all the possible paths of an object
 * @example
 * type Keys = NestedKeyOf<{ a: { b: { c: string } }>
 * // 'a' | 'a.b' | 'a.b.c'
 */
type NestedKeyOf<ObjectType extends object> = {
	[Key in keyof ObjectType &
		(string | number)]: ObjectType[Key] extends object
		? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
		: `${Key}`;
}[keyof ObjectType & (string | number)];

type RecordNamePaths<T extends object> = {
	[K in NestedKeyOf<T>]: PropType<T, K>;
};
