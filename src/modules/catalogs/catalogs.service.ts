import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Parent } from './entities/parent.entity';
import { EntityManager, In, Repository } from 'typeorm';
import { Child } from './entities/child.entity';
import { ChildDto, ChildUpdateDto } from './dto/child.dto';

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
		const { CodigoCatalogo, ...childData } = createChildDto;

		const parent = await this.parentsRepository.findOne({ where: { Codigo: CodigoCatalogo } });
		if (!parent) {
		  throw new NotFoundException('Padre no encontrado');
		}

		const parentChild = await this.childrensRepository.findOne({ where: { Id: createChildDto.PadreId } });
		if (!parentChild) {
		  throw new NotFoundException('Elemento superior de la jerarquía no encontrado');
		}

		const child = this.childrensRepository.create({
		  ...childData,
		  CodigoCatalogo,
		  PadreId: parentChild.Id,
		});

		return await this.childrensRepository.save(child);
	  }

	async updateChild(id: number, updateChildDto: ChildUpdateDto): Promise<Child> {
		const child = await this.childrensRepository.findOneBy({ Id: id });
		if (!child) {
			throw new NotFoundException('Hijo no encontrado');
		}

		const { CodigoCatalogo, ...updateData } = updateChildDto;
		if (CodigoCatalogo) {
			const parent = await this.parentsRepository.findOne({ where: { Codigo: CodigoCatalogo } });
			if (parent) {
				updateData.PadreId = parent.Id;
			}
		}
		Object.assign(child, updateData);
		return await this.childrensRepository.save(child);
	}

	async changeOrder(id: number, order: number): Promise<Child> {
		const child = await this.childrensRepository.findOneBy({ Id: id });
		if (!child) {
			throw new NotFoundException('Hijo no encontrado');
		}
		child.Orden = order;
		return await this.childrensRepository.save(child);
	}

	async changeParent(id: number, parentId: number): Promise<Child> {
		const child = await this.childrensRepository.findOneBy({ Id: id });
		if (!child) {
			throw new NotFoundException('Hijo no encontrado');
		}
		const parent = await this.parentsRepository.findOneBy({ Id: parentId });
		if (!parent) {
			throw new NotFoundException('Padre no encontrado');
		}
		child.PadreId = parentId;
		child.parent = parent;
		return await this.childrensRepository.save(child);
	}

	async changeStatus(id: number): Promise<Child> {
		const child = await this.childrensRepository.findOneBy({ Id: id });
		if (!child) {
			throw new NotFoundException('Hijo no encontrado');
		}

		child.Estado = !child.Estado;
		return await this.childrensRepository.save(child);
	}

	async deleteChild(id: number): Promise<void> {
		const result = await this.childrensRepository.delete(id);
		if (result.affected === 0) {
			throw new NotFoundException('Hijo no encontrado');
		}
	}

	async getChildById(id: number): Promise<Child> {
		const child = await this.childrensRepository.findOneBy({ Id: id });
		if (!child) {
			throw new NotFoundException('Hijo no encontrado');
		}
		return child;
	}

	async getChildrenByKey(key: string): Promise<Child[]> {
		return await this.childrensRepository.find({ where: { CodigoCatalogo: key } });
	}

	async getChildrenByKeys(keys: string[]): Promise<Child[]> {
		return await this.childrensRepository.find({ where: { CodigoCatalogo: In(keys) } });
	}
}
