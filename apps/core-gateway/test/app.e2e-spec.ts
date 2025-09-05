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

  it('POST /companies invalid', async () => {
    await request(app.getHttpServer()).post('/companies').send({ name: 'Bad' }).expect(400);
  });

  it('POST /brands', async () => {
    const companyRes = await request(app.getHttpServer())
      .post('/companies')
      .send({ name: 'Acme', slug: 'acme', country: 'ES', currency: 'EUR' })
      .expect(201);
    const companyId = companyRes.body.id;
    const res = await request(app.getHttpServer())
      .post('/brands')
      .send({ companyId, name: 'Brand', slug: 'brand' })
      .expect(201);
    expect(res.body).toMatchObject({ companyId, name: 'Brand', slug: 'brand' });
  });

  it('POST /sync/pim/product', async () => {
    const product = { id: 'new', name: 'Prod', sku: 'SKU1', status: 'Activo' };
    const res = await request(app.getHttpServer())
      .post('/sync/pim/product')
      .send(product)
      .expect(201);
    expect(res.body).toEqual(product);
  });

  it('POST /sync/pim/product invalid', async () => {
    await request(app.getHttpServer()).post('/sync/pim/product').send({ id: 'new' }).expect(400);
  });

  it('POST /sync/pim/variant', async () => {
    const variant = { id: 'v1', productId: 'p1', sku: 'SKU1' };
    const res = await request(app.getHttpServer())
      .post('/sync/pim/variant')
      .send(variant)
      .expect(201);
    expect(res.body).toEqual(variant);
  });

  it('inventory flow', async () => {
    await request(app.getHttpServer()).get('/stock').expect(200).expect([]);
    const adjust = { warehouseId: 'wh1', variantId: 'v1', quantity: 5 };
    await request(app.getHttpServer()).post('/stock/adjust').send(adjust).expect(201).expect(adjust);
    await request(app.getHttpServer()).get('/stock').expect(200).expect([adjust]);
    const movements = await request(app.getHttpServer()).get('/inventory/movements').expect(200);
    expect(movements.body).toHaveLength(1);
  });

  it('POST /stock/adjust invalid', async () => {
    await request(app.getHttpServer())
      .post('/stock/adjust')
      .send({ warehouseId: 'wh1', variantId: 'v1' })
      .expect(400);
  });
});
