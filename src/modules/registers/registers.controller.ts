import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegistersService } from './registers.service';

@Controller('registers')
export class RegistersController {
	constructor(private readonly registersService: RegistersService) { }
}
