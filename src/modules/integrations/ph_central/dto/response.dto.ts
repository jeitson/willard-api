export interface AuthResponse {
	token: string;
}
export interface CreateDocumentResponse {
	status: number;
	message: string
}

export interface GetClientByDateResponse {
	Oid: string;
	TipoDocumento: string;
	Documento: string;
	activo: string;
	primernombre: string;
	segundonombre: string;
	primerapellido: string;
	segundoapellido: string;
	razonsocial: string;
	sucursales: Sucursale[];
}

export interface Sucursale {
	oid: string;
	nombre: string;
	direccion: string;
	ciudad: string;
	postal: string;
	Telefonofijo: string;
	celular: string;
	correo: string;
}


export interface GetDocumentResponse {
	irc: IRC[];
	erc: Erc[];
	remisiones: Remisione[];
}

export interface Erc {
	erc: string;
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
	irc: string;
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
	paraotro_tipodedocumentodeidentificacion: string;
	paraotro_numerodedocumentodeidentificacion: string;
}

export interface Remisione {
	remision: string;
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
