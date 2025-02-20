export class ConciliationDto {}

export class ListConciliationDto {
	transporter: string;
	id: number;
	route: string;
	zone: string;
	recuperator: string;
	totalQuantity: number;
	status: string;
}
