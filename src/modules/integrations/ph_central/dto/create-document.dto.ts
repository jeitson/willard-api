export class CreateDocuments {
	irc: IRC[];
	erc: Erc[];
	remisiones: Remisione[];
}

export class Erc {
	agencia: string;
	facturadeventa: string;
	entregadopor: string;
	observacion: string;
	fecha: string;
	items: ErcItem[];
}

export class ErcItem {
	referencia: string;
	cantidad: string;
}

export class IRC {
	agencia: string;
	cliente: string;
	fecha: string;
	recibido_por: string;
	observacion: string;
	items: IRCItem[];
}

export class IRCItem {
	referencia: string;
	cantidad: string;
	paraotro_tipodedocumentodeidentificacion?: string;
	paraotro_numerodedocumentodeidentificacion?: string;
}

export class Remisione {
	agencia: string;
	fecha: string;
	recibido_por: string;
	transportadora: string;
	placa: string;
	conductor: string;
	recuperador: string;
	observacion: string;
	items: RemisioneItem[];
}

export class RemisioneItem {
	erc: string;
	factura: string;
	referencia: string;
	cantidad: string;
}


export class GetDocumentsByDate {
	FechaHoraInicial: Date;
	FechaHoraFinal: Date
}
