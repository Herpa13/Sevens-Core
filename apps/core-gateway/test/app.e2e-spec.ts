import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ZodValidationPipe } from '../src/zod.pipe';
import { reset } from '@sevens/db';

describe('App e2e', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.useGlobalPipes(new ZodValidationPipe());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  beforeEach(async () => {
    await reset();
  });

  afterAll(async () => {
    await app.close();
    await reset();
  });

  it('GET /health', () => {
    return request(app.getHttpServer()).get('/health').expect(200).expect({ status: 'ok' });
  });

  it('GET /ready', () => {
    return request(app.getHttpServer()).get('/ready').expect(200).expect({ status: 'ok' });
  });

  it('POST /companies', async () => {
    const res = await request(app.getHttpServer())
      .post('/companies')
      .send({ name: 'Acme', slug: 'acme', country: 'ES', currency: 'EUR' })
      .expect(201);
    expect(res.body).toMatchObject({ name: 'Acme', slug: 'acme', country: 'ES', currency: 'EUR' });
  });
});
