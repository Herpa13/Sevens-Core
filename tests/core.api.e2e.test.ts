import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '../apps/core-gateway/src/app.module';
import { ZodValidationPipe } from '../apps/core-gateway/src/zod.pipe';
import { reset } from '@sevens/db';

let app: NestFastifyApplication;
let baseUrl: string;

describe('CORE API via HTTP', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.useGlobalPipes(new ZodValidationPipe());
    await app.listen(0, '127.0.0.1');
    const instance: any = app.getHttpAdapter().getInstance();
    const address = instance.server.address();
    const port = typeof address === 'string' ? 0 : address.port;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  afterAll(async () => {
    await app.close();
    await reset();
  });

  beforeEach(async () => {
    await reset();
  });

  it('GET /health', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ status: 'ok' });
  });

  it('GET /ready', async () => {
    const res = await fetch(`${baseUrl}/ready`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ status: 'ok' });
  });

  it('GET /stock', async () => {
    const res = await fetch(`${baseUrl}/stock`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual([]);
  });
});
