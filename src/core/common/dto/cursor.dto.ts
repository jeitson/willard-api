import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class CursorDto {
	@ApiProperty({ minimum: 0, default: 0 })
	@Min(0)
	@IsInt({ message: 'Debe de ser un número' })
	@Expose()
	@IsOptional({ always: true })
	@Transform(({ value: val }) => (val ? Number.parseInt(val) : 0), {
		toClassOnly: true,
	})
	cursor?: number;

	@ApiProperty({ minimum: 1, maximum: 100, default: 10 })
	@Min(1)
	@Max(100)
	@IsInt({ message: 'Debe de ser un número' })
	@IsOptional({ always: true })
	@Expose()
	@Transform(({ value: val }) => (val ? Number.parseInt(val) : 10), {
		toClassOnly: true,
	})
	limit?: number;
}
