import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { CollectionSitesService } from './collection_sites.service';
import { CollectionSiteCreateDto, CollectionSiteQueryDto, CollectionSiteUpdateDto } from './dto/collection_site.dto';
import { CollectionSite } from './entities/collection_site.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';

@ApiTags('Negocio - Centro de acopios')
@Controller('collection-sites')
export class CollectionSitesController {
	constructor(private readonly collectionSitesService: CollectionSitesService) { }

	@Post()
	@ApiOperation({ summary: 'Creación de centros de acopio' })
	create(@Body() createCollectionSiteDto: CollectionSiteCreateDto): Promise<CollectionSite> {
		return this.collectionSitesService.create(createCollectionSiteDto);
	}

	@Get()
	@ApiOperation({ summary: 'Obtener listado de centros de acopios - Paginación' })
	@ApiResult({ type: [CollectionSite], isPage: true })
	async findAll(@Query() dto: CollectionSiteQueryDto) {
		return this.collectionSitesService.findAll(dto);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obtener centro de acopio por su ID' })
	findOne(@IdParam('id') id: string): Promise<CollectionSite> {
		return this.collectionSitesService.findOne(+id);
	}

	@Put(':id')
	@ApiOperation({ summary: 'Actualizar centro de acopio' })
	update(@IdParam('id') id: string, @Body() updateCollectionSiteDto: CollectionSiteUpdateDto): Promise<CollectionSite> {
		return this.collectionSitesService.update(+id, updateCollectionSiteDto);
	}

	@Patch(':id/change-status')
	@ApiOperation({ summary: 'Cambiar de estado centro de acopio' })
	changeStatus(@IdParam('id') id: string, @Body('status') status: boolean): Promise<CollectionSite> {
		return this.collectionSitesService.changeStatus(+id, status);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar centro de acopio' })
	remove(@IdParam('id') id: string): Promise<void> {
		return this.collectionSitesService.remove(+id);
	}
}
