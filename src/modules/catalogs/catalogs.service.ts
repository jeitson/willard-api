import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Parent } from './entities/parent.entity';
import { EntityManager, In, Repository } from 'typeorm';
import { Child } from './entities/child.entity';
import { ChildDto, ChildUpdateDto } from './dto/child.dto';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';

@Injectable()
export class CatalogsService {

	constructor(
		@InjectRepository(Parent)
		private readonly parentsRepository: Repository<Parent>,
		@InjectRepository(Child)
		private readonly childrensRepository: Repository<Child>,
		@InjectEntityManager() private entityManager: EntityManager
	) { }

	async createChild(createChildDto: ChildDto): Promise<Child> {
		const { catalogCode, name, ...childData } = createChildDto;

		const existChild = await this.childrensRepository.findOne({ where: { name  } });
		if (!existChild) {
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

		const child = this.childrensRepository.create({
		  ...childData,
		  name,
		  catalogCode,
		  parentId: parentChild.id,
		});

		return await this.childrensRepository.save(child);
	  }

	async updateChild(id: number, updateChildDto: ChildUpdateDto): Promise<Child> {
		const child = await this.childrensRepository.findOneBy({ id });
		if (!child) {
			throw new BusinessException('Hijo no encontrado', 400);
		}

		const { catalogCode, ...updateData } = updateChildDto;
		if (catalogCode) {
			const parent = await this.parentsRepository.findOne({ where: { code: catalogCode } });
			if (parent) {
				updateData.parentId = parent.id;
			}
		}
		Object.assign(child, updateData);
		return await this.childrensRepository.save(child);
	}

	async changeOrder(id: number, order: number): Promise<Child> {
		const child = await this.childrensRepository.findOneBy({ id });
		if (!child) {
			throw new BusinessException('Hijo no encontrado', 400);
		}
		child.order = order;
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
		child.parentId = parentId;
		child.parent = parent;
		return await this.childrensRepository.save(child);
	}

	async changeStatus(id: number): Promise<Child> {
		const child = await this.childrensRepository.findOneBy({ id });
		if (!child) {
			throw new BusinessException('Hijo no encontrado', 400);
		}

		child.status = !child.status;
		return await this.childrensRepository.save(child);
	}

	async deleteChild(id: number): Promise<void> {
		const result = await this.childrensRepository.delete(id);
		if (result.affected === 0) {
			throw new BusinessException('Hijo no encontrado', 400);
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
		return await this.childrensRepository.find({ where: { catalogCode: key } });
	}

	async getChildrenByKeyAndParent(key: string, parentId: number): Promise<Child[]> {
		return await this.childrensRepository.find({ where: { catalogCode: key, parentId } });
	}

	async getChildrenByKeys(keys: string[]): Promise<Child[]> {
		return await this.childrensRepository.find({ where: { catalogCode: In(keys) } });
	}
}
