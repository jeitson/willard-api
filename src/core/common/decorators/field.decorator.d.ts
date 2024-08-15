interface IOptionalOptions {
    required?: boolean;
}
interface INumberFieldOptions extends IOptionalOptions {
    each?: boolean;
    int?: boolean;
    min?: number;
    max?: number;
    positive?: boolean;
}
interface IStringFieldOptions extends IOptionalOptions {
    each?: boolean;
    minLength?: number;
    maxLength?: number;
    lowerCase?: boolean;
    upperCase?: boolean;
}
export declare function NumberField(options?: INumberFieldOptions): PropertyDecorator;
export declare function StringField(options?: IStringFieldOptions): PropertyDecorator;
export declare function BooleanField(options?: IOptionalOptions): PropertyDecorator;
export declare function DateField(options?: IOptionalOptions): PropertyDecorator;
export {};
