"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../src/app.module");
const zod_pipe_1 = require("../src/zod.pipe");
const db_1 = require("@sevens/db");
describe('App e2e', () => {
    let app;
    beforeAll(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication(new platform_fastify_1.FastifyAdapter());
        app.useGlobalPipes(new zod_pipe_1.ZodValidationPipe());
        await app.init();
        await app.getHttpAdapter().getInstance().ready();
    });
    beforeEach(async () => {
        await (0, db_1.reset)();
    });
    afterAll(async () => {
        await app.close();
        await (0, db_1.reset)();
    });
    it('GET /health', () => {
        return (0, supertest_1.default)(app.getHttpServer()).get('/health').expect(200).expect({ status: 'ok' });
    });
    it('GET /ready', () => {
        return (0, supertest_1.default)(app.getHttpServer()).get('/ready').expect(200).expect({ status: 'ok' });
    });
    it('POST /companies', async () => {
        const res = await (0, supertest_1.default)(app.getHttpServer())
            .post('/companies')
            .send({ name: 'Acme', slug: 'acme', country: 'ES', currency: 'EUR' })
            .expect(201);
        expect(res.body).toMatchObject({ name: 'Acme', slug: 'acme', country: 'ES', currency: 'EUR' });
    });
    it('POST /companies invalid', async () => {
        await (0, supertest_1.default)(app.getHttpServer()).post('/companies').send({ name: 'Bad' }).expect(400);
    });
    it('POST /brands', async () => {
        const companyRes = await (0, supertest_1.default)(app.getHttpServer())
            .post('/companies')
            .send({ name: 'Acme', slug: 'acme', country: 'ES', currency: 'EUR' })
            .expect(201);
        const companyId = companyRes.body.id;
        const res = await (0, supertest_1.default)(app.getHttpServer())
            .post('/brands')
            .send({ companyId, name: 'Brand', slug: 'brand' })
            .expect(201);
        expect(res.body).toMatchObject({ companyId, name: 'Brand', slug: 'brand' });
    });
    it('POST /sync/pim/product', async () => {
        const product = { id: 'new', name: 'Prod', sku: 'SKU1', status: 'Activo' };
        const res = await (0, supertest_1.default)(app.getHttpServer())
            .post('/sync/pim/product')
            .send(product)
            .expect(201);
        expect(res.body).toEqual(product);
    });
    it('POST /sync/pim/product invalid', async () => {
        await (0, supertest_1.default)(app.getHttpServer()).post('/sync/pim/product').send({ id: 'new' }).expect(400);
    });
    it('POST /sync/pim/variant', async () => {
        const variant = { id: 'v1', productId: 'p1', sku: 'SKU1' };
        const res = await (0, supertest_1.default)(app.getHttpServer())
            .post('/sync/pim/variant')
            .send(variant)
            .expect(201);
        expect(res.body).toEqual(variant);
    });
    it('inventory flow', async () => {
        await (0, supertest_1.default)(app.getHttpServer()).get('/stock').expect(200).expect([]);
        const adjust = { warehouseId: 'wh1', variantId: 'v1', quantity: 5 };
        await (0, supertest_1.default)(app.getHttpServer()).post('/stock/adjust').send(adjust).expect(201).expect(adjust);
        await (0, supertest_1.default)(app.getHttpServer()).get('/stock').expect(200).expect([adjust]);
        const movements = await (0, supertest_1.default)(app.getHttpServer()).get('/inventory/movements').expect(200);
        expect(movements.body).toHaveLength(1);
    });
    it('POST /stock/adjust invalid', async () => {
        await (0, supertest_1.default)(app.getHttpServer())
            .post('/stock/adjust')
            .send({ warehouseId: 'wh1', variantId: 'v1' })
            .expect(400);
    });
});
