import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Parent } from './entities/parent.entity';
import { EntityManager, In, Repository } from 'typeorm';
import { Child } from './entities/child.entity';
import { ChildDto, ChildUpdateDto } from './dto/child.dto';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { UserContextService } from '../users/user-context.service';

@Injectable()
export class CatalogsService {

	constructor(
		@InjectRepository(Parent)
		private readonly parentsRepository: Repository<Parent>,
		@InjectRepository(Child)
		private readonly childrensRepository: Repository<Child>,
		private readonly userContextService: UserContextService
	) { }

	async createChild(createChildDto: ChildDto): Promise<Child> {
		let { catalogCode, name, ...childData } = createChildDto;
		name = name.toUpperCase();
		catalogCode = catalogCode.toUpperCase();

		const existChild = await this.childrensRepository.findOne({ where: { name, catalogCode } });
		if (existChild) {
			throw new BusinessException('Ya existe el catálogo', 400);
		}

		const parent = await this.parentsRepository.findOne({ where: { code: catalogCode } });
		if (!parent) {
			throw new BusinessException('Padre no encontrado', 400);
		}

		const parentChild = await this.childrensRepository.findOne({ where: { id: createChildDto.parentId } });
		if (!parentChild) {
			throw new BusinessException('Elemento superior de la jerarquía no encontrado', 400);
		}

		const user_id = this.userContextService.getUserDetails().id;

		const child = this.childrensRepository.create({
			...childData,
			name,
			catalogCode,
			parent: parent,
			createdBy: user_id, modifiedBy: user_id
		});

		return await this.childrensRepository.save(child);
	}

	async updateChild(id: number, updatedData: ChildUpdateDto): Promise<Child> {
		const child = await this.childrensRepository.findOneBy({ id });

		if (!child) {
			throw new BusinessException('Hijo no encontrado', 400);
		}

		let { catalogCode, name, ...updateData } = updatedData;
		catalogCode = catalogCode.toUpperCase();
		name = name.toUpperCase();

		const existChild = await this.childrensRepository.findOne({ where: { name, catalogCode } });

		if (existChild.id !== child.id) {
			throw new BusinessException('Ya existe un catálogo con esa configuración', 400);
		}

		if (catalogCode) {
			const parent = await this.parentsRepository.findOne({ where: { code: catalogCode } });
			if (parent) {
				updateData.parentId = parent.id;
			}
		}

		const modifiedBy = this.userContextService.getUserDetails().id;

		updatedData = Object.assign(child, updatedData);
		return await this.childrensRepository.save({ ...updatedData, catalogCode, name, modifiedBy });
	}

	async changeOrder(id: number, order: number): Promise<Child> {
		const child = await this.childrensRepository.findOneBy({ id });

		if (!child) {
			throw new BusinessException('Hijo no encontrado', 400);
		}

		const user_id = this.userContextService.getUserDetails().id;

		child.order = order;
		child.modifiedBy = user_id;

		return await this.childrensRepository.save(child);
	}


	async changeParent(id: number, parentId: number): Promise<Child> {
		const child = await this.childrensRepository.findOneBy({ id });
		if (!child) {
			throw new BusinessException('Hijo no encontrado', 400);
		}

		const parent = await this.parentsRepository.findOneBy({ id: parentId });

		if (!parent) {
			throw new BusinessException('Padre no encontrado', 400);
		}
		const user_id = this.userContextService.getUserDetails().id;

		child.parent = parent;
		child.modifiedBy = user_id;

		return await this.childrensRepository.save(child);
	}

	async changeStatus(id: number): Promise<Child> {
		const child = await this.childrensRepository.findOneBy({ id });

		if (!child) {
			throw new BusinessException('Hijo no encontrado', 400);
		}

		const user_id = this.userContextService.getUserDetails().id;

		child.status = !child.status;
		child.modifiedBy = user_id;

		return await this.childrensRepository.save(child);
	}

	async deleteChild(id: number): Promise<void> {
		try {
			const result = await this.childrensRepository.delete(id);

			if (result.affected === 0) {
				throw new BusinessException('Hijo no encontrado', 400);
			}
		} catch (error) {
			if (error.code === '23503') {
				throw new BusinessException('No se puede eliminar el hijo porque ya cuenta con una relación.', 400);
			}
			throw error;
		}
	}

	async getChildById(id: number): Promise<Child> {
		const child = await this.childrensRepository.findOneBy({ id });
		if (!child) {
			throw new BusinessException('Hijo no encontrado', 400);
		}
		return child;
	}

	async getChildrenByKey(key: string): Promise<Child[]> {
		return await this.childrensRepository.find({ where: { catalogCode: key.toUpperCase(), status: true }});
	}

	async getChildrenByName(name: string): Promise<Child[]> {
		return await this.childrensRepository.find({ where: { name: name.toUpperCase(), status: true }});
	}

	async getChildrenByKeyAndParent(key: string, parentId: number): Promise<Child[]> {
		return await this.childrensRepository.find({ where: { catalogCode: key.toUpperCase(), parent: { id: parentId }, status: true }});
	}

	async getChildrenByKeys(keys: string[]): Promise<Child[]> {
		return await this.childrensRepository.find({ where: { catalogCode: In(keys.map((key) => key.toUpperCase())), status: true }});
	}
}
