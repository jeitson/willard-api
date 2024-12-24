/**
 * Archivo de configuración para redirigir solicitudes HTTP
 * a tu aplicación NestJS usando Firebase Functions.
 */

import * as functions from "firebase-functions";
import express from "express";
import { ExpressAdapter } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./../../dist/app.module";

const server = express();

async function bootstrap() {
	const adapter = new ExpressAdapter(server);
	const app = await NestFactory.create(AppModule, adapter);

	await app.init();
}

bootstrap().catch((error) => {
	console.error("Error al inicializar NestJS", error);
});

export const api = functions.https.onRequest(server);
