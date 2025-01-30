export interface CreateDocuments {
	irc: IRC[];
	erc: Erc[];
	remisiones: Remisione[];
}

export interface Erc {
	agencia: string;
	facturadeventa: string;
	entregadopor: string;
	observacion: string;
	fecha: string;
	items: ErcItem[];
}

export interface ErcItem {
	referencia: string;
	cantidad: string;
}

export interface IRC {
	agencia: string;
	cliente: string;
	fecha: string;
	recibido_por: string;
	observacion: string;
	items: IRCItem[];
}

export interface IRCItem {
	referencia: string;
	cantidad: string;
	paraotro_tipodedocumentodeidentificacion?: string;
	paraotro_numerodedocumentodeidentificacion?: string;
}

export interface Remisione {
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

export interface RemisioneItem {
	erc: string;
	factura: string;
	referencia: string;
	cantidad: string;
}


export interface GetDocumentsByDate {
	FechaHoraInicial: Date;
	FechaHoraFinal: Date
}
