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
exports.EntityExistConstraint = void 0;
exports.IsEntityExist = IsEntityExist;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
let EntityExistConstraint = class EntityExistConstraint {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async validate(value, args) {
        let repo;
        if (!value)
            return true;
        let field = 'id';
        if ('entity' in args.constraints[0]) {
            field = args.constraints[0].field ?? 'id';
            repo = this.dataSource.getRepository(args.constraints[0].entity);
        }
        else {
            repo = this.dataSource.getRepository(args.constraints[0]);
        }
        const item = await repo.findOne({ where: { [field]: value } });
        return !!item;
    }
    defaultMessage(args) {
        if (!args.constraints[0])
            return '¡No se ha especificado la entidad!';
        return `Todos los registros de ${args.constraints[0].name} deben existir en la base de datos.`;
    }
};
exports.EntityExistConstraint = EntityExistConstraint;
exports.EntityExistConstraint = EntityExistConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'entityItemExist', async: true }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], EntityExistConstraint);
function IsEntityExist(entity, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [entity],
            validator: EntityExistConstraint,
        });
    };
}
//# sourceMappingURL=entity-exist.constraint.js.map