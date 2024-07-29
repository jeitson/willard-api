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

		const child = this.childrensRepository.create({
			...childData,
			parent,
			PadreId: parent.Id,
		});

		return await this.childrensRepository.save(child);
	}

	async updateChild(id: string, updateChildDto: ChildUpdateDto): Promise<Child> {
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

	async changeOrder(id: string, order: number): Promise<Child> {
		const child = await this.childrensRepository.findOneBy({ Id: id });
		if (!child) {
			throw new NotFoundException('Hijo no encontrado');
		}
		child.Orden = order;
		return await this.childrensRepository.save(child);
	}

	async changeParent(id: string, parentId: string): Promise<Child> {
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

	async changeStatus(id: string): Promise<Child> {
		const child = await this.childrensRepository.findOneBy({ Id: id });
		if (!child) {
			throw new NotFoundException('Hijo no encontrado');
		}

		child.Estado = !child.Estado;
		return await this.childrensRepository.save(child);
	}

	async deleteChild(id: string): Promise<void> {
		const result = await this.childrensRepository.delete(id);
		if (result.affected === 0) {
			throw new NotFoundException('Hijo no encontrado');
		}
	}

	async getChildById(id: string): Promise<Child> {
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
