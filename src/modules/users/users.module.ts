import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

const providers = [UsersService]

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [UsersController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class UsersModule { }
