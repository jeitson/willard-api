"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberField = NumberField;
exports.StringField = StringField;
exports.BooleanField = BooleanField;
exports.DateField = DateField;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const lodash_1 = require("lodash");
const transform_decorator_1 = require("./transform.decorator");
function NumberField(options = {}) {
    const { each, min, max, int, positive, required = true } = options;
    const decorators = [(0, transform_decorator_1.ToNumber)()];
    if (each)
        decorators.push((0, transform_decorator_1.ToArray)());
    if (int)
        decorators.push((0, class_validator_1.IsInt)({ each }));
    else
        decorators.push((0, class_validator_1.IsNumber)({}, { each }));
    if ((0, lodash_1.isNumber)(min))
        decorators.push((0, class_validator_1.Min)(min, { each }));
    if ((0, lodash_1.isNumber)(max))
        decorators.push((0, class_validator_1.Max)(max, { each }));
    if (positive)
        decorators.push((0, class_validator_1.IsPositive)({ each }));
    if (!required)
        decorators.push((0, class_validator_1.IsOptional)());
    return (0, common_1.applyDecorators)(...decorators);
}
function StringField(options = {}) {
    const { each, minLength, maxLength, lowerCase, upperCase, required = true, } = options;
    const decorators = [(0, class_validator_1.IsString)({ each }), (0, transform_decorator_1.ToTrim)()];
    if (each)
        decorators.push((0, transform_decorator_1.ToArray)());
    if ((0, lodash_1.isNumber)(minLength))
        decorators.push((0, class_validator_1.MinLength)(minLength, { each }));
    if ((0, lodash_1.isNumber)(maxLength))
        decorators.push((0, class_validator_1.MaxLength)(maxLength, { each }));
    if (lowerCase)
        decorators.push((0, transform_decorator_1.ToLowerCase)());
    if (upperCase)
        decorators.push((0, transform_decorator_1.ToUpperCase)());
    if (!required)
        decorators.push((0, class_validator_1.IsOptional)());
    else
        decorators.push((0, class_validator_1.IsNotEmpty)({ each }));
    return (0, common_1.applyDecorators)(...decorators);
}
function BooleanField(options = {}) {
    const decorators = [(0, transform_decorator_1.ToBoolean)(), (0, class_validator_1.IsBoolean)()];
    const { required = true } = options;
    if (!required)
        decorators.push((0, class_validator_1.IsOptional)());
    return (0, common_1.applyDecorators)(...decorators);
}
function DateField(options = {}) {
    const decorators = [(0, transform_decorator_1.ToDate)(), (0, class_validator_1.IsDate)()];
    const { required = true } = options;
    if (!required)
        decorators.push((0, class_validator_1.IsOptional)());
    return (0, common_1.applyDecorators)(...decorators);
}
//# sourceMappingURL=field.decorator.js.map