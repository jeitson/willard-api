export class CreateAuditRouteDto {}
export class ListAuditRouteDto {
	origin: string;
	transporter: string;
	routeId: string;
	zone: string;
	date: string;
	recuperator: string;
	quantityTotal: number;
	gap: string;
	status: string;
}
