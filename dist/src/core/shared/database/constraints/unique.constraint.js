"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniqueConstraint = void 0;
exports.IsUnique = IsUnique;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
let UniqueConstraint = class UniqueConstraint {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async validate(value, args) {
        const config = {
            field: args.property,
        };
        const condition = ('entity' in args.constraints[0]
            ? (0, lodash_1.merge)(config, args.constraints[0])
            : {
                ...config,
                entity: args.constraints[0],
            });
        if (!condition.entity)
            return false;
        try {
            const repo = this.dataSource.getRepository(condition.entity);
            return (0, lodash_1.isNil)(await repo.findOne({
                where: { [condition.field]: value },
            }));
        }
        catch (err) {
            return false;
        }
    }
    defaultMessage(args) {
        const { entity, property } = args.constraints[0];
        const queryProperty = property ?? args.property;
        if (!args.object.getManager)
            return '¡No se ha encontrado la función getManager!';
        if (!entity)
            return '¡No se ha especificado la entidad!';
        return `${queryProperty} de ${entity.name} debe ser único.`;
    }
};
exports.UniqueConstraint = UniqueConstraint;
exports.UniqueConstraint = UniqueConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'entityItemUnique', async: true }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], UniqueConstraint);
function IsUnique(entity, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [entity],
            validator: UniqueConstraint,
        });
    };
}
//# sourceMappingURL=unique.constraint.js.map