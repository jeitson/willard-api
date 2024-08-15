import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
export declare class CatsService {
    create(createCatDto: CreateCatDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCatDto: UpdateCatDto): string;
    remove(id: number): string;
}
