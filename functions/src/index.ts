import { onRequest } from 'firebase-functions/v2/https';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './../../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const server = express();

export const api = onRequest(async (req, res) => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await app.init();
  app.getHttpAdapter().getInstance().use(req, res);
});
