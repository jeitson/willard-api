import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Child } from 'src/modules/catalogs/entities/child.entity';
import { Parent } from 'src/modules/catalogs/entities/parent.entity';
import { Role } from 'src/modules/roles/entities/rol.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { In, RemoveOptions, Repository, SaveOptions } from 'typeorm';
import { ROL } from '../constants/rol.constant';

@Injectable()
export class InitializationService implements OnApplicationBootstrap {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,
		@InjectRepository(Child)
		private readonly childRepository: Repository<Child>,
		@InjectRepository(Parent)
		private readonly parentRepository: Repository<Parent>,
	) { }

	async onApplicationBootstrap() {
		try {
			// this.seedRoles();
		} catch (error) {
			console.error('❌ Error durante la inicialización:', error.message);
		}
	}

	private async seedRoles() {
		const roles: any[] = [
			{
				name: 'Administrador',
				description: 'Usuario administrador',
				status: true,
				id: ROL.ADMINISTRATOR, // ID específico del enum
				menu: JSON.stringify([
					{ "type": "link", "id": "1" },
					{ "type": "sub", "id": "2", "children": [{ "id": "21" },{ "id": "22" },{ "id": "23" },{ "id": "24" },{ "id": "26" },{ "id": "27" }]},
					{ "type": "sub", "id": "3", "children": [{ "id": "31" }, { "id": "32" }, { "id": "33" }]},
					{ "type": "sub", "id": "4", "children": [{ "id": "41" },{ "id": "42" },{ "id": "43" },{ "id": "44" },{ "id": "45" },{ "id": "46" },{ "id": "47" },{ "id": "48" },{ "id": "49" },{ "id": "410" },{ "id": "411" },{ "id": "412" },{ "id": "413" },{ "id": "414" },{ "id": "415" },{ "id": "416" },{ "id": "417" },{ "id": "418" },{ "id": "419" },{ "id": "421" }]}
				]),
				users: [],
			},
			// Agrega más roles aquí si es necesario
		];

		// Buscar roles existentes por sus IDs
		const existingRoles = await this.roleRepository.find({
			where: { id: In(roles.map((role) => role.id)) },
		});

		// Obtener los IDs de los roles existentes
		const existingIds = existingRoles.map((role) => role.id);

		// Filtrar roles que aún no existen en la base de datos
		const rolesToInsert = roles.filter((role) => !existingIds.includes(role.id));

		if (rolesToInsert.length > 0) {
			console.log('🌱 Insertando datos iniciales en `rol`...');

			// Crear instancias de la entidad Role para los roles que faltan
			for (const role of rolesToInsert) {
				try {
					// Crear el nuevo rol
					const newRole = this.roleRepository.create({
						...role,
						id: role.id, // Asegúrate de asignar el ID explícitamente
					});

					// Guardar el rol en la base de datos
					await this.roleRepository.save(newRole);

					console.log(`✅ Rol insertado: ${role.name} (ID: ${role.id})`);
				} catch (error) {
					console.error(`❌ Error al insertar el rol ${role.name}:`, error.message);
				}
			}

			console.log(`✅ Se insertaron ${rolesToInsert.length} roles.`);
		} else {
			console.log('✅ Todos los roles ya existen en la base de datos.');
		}
	}

	// Método para insertar datos iniciales en `transportadora_viaje`
	private async seedUsers() {
		const users: any[] = [{
			cellphone: '1234567890',
			oauthId: 'auth0|6706e38b480b746c46175522',
			email: 'administrator@correo.com',
			name: 'Administrador',
			description: 'Usuario administrador',
			status: true,
		}];

		const _users = this.userRepository.find({ where: { oauthId: In(users.map((element) => element.oauthId)) }});

		console.log('🌱 Insertando datos iniciales en `transportadora_viaje`...');
		// const initialData = this.transporterTravelRepository.create({
		// 	routeId: 'RUTA-001',
		// 	guideId: 'GUIA-001',
		// 	type: 'RECOGIDA',
		// 	sequence: 1,
		// 	movementDate: new Date().toISOString().split('T')[0],
		// 	movementTime: '08:00:00',
		// 	planner: 1,
		// 	zone: 'Zona Norte',
		// 	city: 'Ciudad A',
		// 	department: 'Departamento X',
		// 	licensePlate: 'ABC123',
		// 	driver: 'Juan Pérez',
		// 	siteName: 'Sitio de Recolección A',
		// 	address: 'Calle Principal #123',
		// 	gpsPosition: '12.3456,-78.9012',
		// 	totalQuantity: 100,
		// 	referenceDocument: 'DOC-001',
		// 	supportUrls: ['http://example.com/support1'],
		// });
		// await this.transporterTravelRepository.save(initialData);
		console.log('✅ Datos iniciales insertados en `transportadora_viaje`.');
	}

	// // Método para insertar datos iniciales en `recepcion`
	// private async seedReceptions() {
	//     console.log('🌱 Insertando datos iniciales en `recepcion`...');
	//     const initialData = this.receptionRepository.create({
	//         licensePlate: 'XYZ789',
	//         driver: 'María López',
	//         routeId: 'RUTA-001',
	//         referenceDoc1: 'DOC-002',
	//         receptionStatusId: 1,
	//     });
	//     await this.receptionRepository.save(initialData);
	//     console.log('✅ Datos iniciales insertados en `recepcion`.');
	// }
}
