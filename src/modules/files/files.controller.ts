import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, UseGuards, UploadedFiles, Get, Query } from '@nestjs/common';
import { FirebaseService } from 'src/core/shared/firebase/firebase.service';
import { AllFilesInterceptor } from 'src/core/common/interceptors/all-file.interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/common/decorators/role.decorator';
import { FileSizeValidationPipe } from 'src/core/common/pipes/file-size-validation.pipe';
import { GetFile } from './dto/file.dto';

@ApiTags('Sistema - Archivos')
@UseGuards(RolesGuard)
@Controller('files')
export class FilesController {
	constructor(private readonly firebaseService: FirebaseService) { }

	@Post('upload')
	@UseInterceptors(AllFilesInterceptor)
	async uploadFile(@UploadedFiles(FileSizeValidationPipe) files: Array<any>) {
		if (files.length === 0) {
			throw new BadRequestException('File is required.');
		}

		return Promise.all(files.map(file => this.firebaseService.uploadFile(file)))
	}

	@Get()
	@ApiOperation({ summary: 'Obtener listado de todos los usuarios - Paginación' })
	async findAll(@Query() { url }: GetFile) {
		return this.firebaseService.getFileUrl(url);
	}
}
