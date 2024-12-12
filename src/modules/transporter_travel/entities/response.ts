import { ApiPropertyOptional } from "@nestjs/swagger";

export class ResponseCodeTransporterTravel {
	@ApiPropertyOptional({ description: 'Codigo de la Solicitud'})
	codigoSolicitud: string;
}
