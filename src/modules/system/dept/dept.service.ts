import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { EntityManager, Repository, TreeRepository } from 'typeorm';

import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/core/constants/error-code.constant';
import { DeptEntity } from 'src/modules/system/dept/dept.entity';
import { UserEntity } from 'src/modules/user/user.entity';

import { deleteEmptyChildren } from 'src/core/utils/list2tree.util';

import { DeptDto, DeptQueryDto, MoveDept } from './dept.dto';

@Injectable()
export class DeptService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		@InjectRepository(DeptEntity)
		private deptRepository: TreeRepository<DeptEntity>,
		@InjectEntityManager() private entityManager: EntityManager,
	) {}

	async list(): Promise<DeptEntity[]> {
		return this.deptRepository.find({ order: { orderNo: 'DESC' } });
	}

	async info(id: string): Promise<DeptEntity> {
		const dept = await this.deptRepository
			.createQueryBuilder('dept')
			.leftJoinAndSelect('dept.parent', 'parent')
			.where({ id })
			.getOne();

		if (isEmpty(dept))
			throw new BusinessException(ErrorEnum.DEPARTMENT_NOT_FOUND);

		return dept;
	}

	async create({ parentId, ...data }: DeptDto): Promise<void> {
		const parent = await this.deptRepository
			.createQueryBuilder('dept')
			.where({ id: parentId })
			.getOne();

		await this.deptRepository.save({
			...data,
			parent,
		});
	}

	async update(id: string, { parentId, ...data }: DeptDto): Promise<void> {
		const item = await this.deptRepository
			.createQueryBuilder('dept')
			.where({ id })
			.getOne();

		const parent = await this.deptRepository
			.createQueryBuilder('dept')
			.where({ id: parentId })
			.getOne();

		await this.deptRepository.save({
			...item,
			...data,
			parent,
		});
	}

	async delete(id: string): Promise<void> {
		await this.deptRepository.delete(id);
	}

	/**
	 * Mover y ordenar departamentos
	 */
	async move(depts: MoveDept[]): Promise<void> {
		await this.entityManager.transaction(async (manager) => {
			await manager.save(depts);
		});
	}

	/**
	 * Contar la cantidad de usuarios asociados a un departamento
	 */
	async countUserByDeptId(id: string): Promise<number> {
		return this.userRepository.countBy({ dept: { id } });
	}

	/**
	 * Contar la cantidad de sub-departamentos bajo un departamento
	 */
	async countChildDept(id: string): Promise<number> {
		const item = await this.deptRepository.findOneBy({ id });
		return (await this.deptRepository.countDescendants(item)) - 1;
	}

	/**
	 * Obtener la lista de departamentos en formato de árbol
	 */
	async getDeptTree(
		uid: string,
		{ name }: DeptQueryDto,
	): Promise<DeptEntity[]> {
		const tree: DeptEntity[] = [];

		if (name) {
			const deptList = await this.deptRepository
				.createQueryBuilder('dept')
				.where('dept.name like :name', { name: `%${name}%` })
				.getMany();

			for (const dept of deptList) {
				const deptTree =
					await this.deptRepository.findDescendantsTree(dept);
				tree.push(deptTree);
			}

			deleteEmptyChildren(tree);

			return tree;
		}

		const deptTree = await this.deptRepository.findTrees({
			depth: 2,
			relations: ['parent'],
		});

		deleteEmptyChildren(deptTree);

		return deptTree;
	}
}
