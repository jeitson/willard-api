export class CreateAuditRouteDto {}
export class ListAuditRouteDto {
	origin: string;
	transporter: string | null;
	routeId: string;
	zone: string;
	date: string;
	recuperator: string | null;
	quantityTotal: number;
	gap: string | null;
	status: string;
}
