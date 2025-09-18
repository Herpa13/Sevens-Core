"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const app_module_1 = require("./app.module");
const zod_pipe_1 = require("./zod.pipe");
const aws_lambda_1 = __importDefault(require("@fastify/aws-lambda"));
let cachedHandler;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    app.useGlobalPipes(new zod_pipe_1.ZodValidationPipe());
    await app.init(); // en Lambda NO listen
    return app.getHttpAdapter().getInstance();
}
const handler = async (event, context) => {
    if (!cachedHandler) {
        const fastifyApp = await bootstrap();
        // Cast a any para evitar choque de tipos en compilación
        cachedHandler = (0, aws_lambda_1.default)(fastifyApp);
    }
    return cachedHandler(event, context);
};
exports.handler = handler;
if (require.main === module) {
    (async () => {
        const fastifyApp = await bootstrap();
        await fastifyApp.listen({ port: 3000, host: '0.0.0.0' });
        console.log('🚀 App corriendo en http://localhost:3000');
    })();
}
