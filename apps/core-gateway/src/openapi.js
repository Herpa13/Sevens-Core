"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function generate() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    const config = new swagger_1.DocumentBuilder().setTitle('Core API').setVersion('1.0').build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    (0, fs_1.writeFileSync)((0, path_1.join)(__dirname, '..', 'openapi.json'), JSON.stringify(document, null, 2));
    await app.close();
}
generate();
