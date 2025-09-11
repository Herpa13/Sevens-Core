import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ZodValidationPipe } from './zod.pipe';
import awsLambdaFastify from '@fastify/aws-lambda';

let cachedHandler: any;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalPipes(new ZodValidationPipe());
  await app.init(); // en Lambda no hacemos listen
  return app.getHttpAdapter().getInstance(); // Fastify instance
}

// Handler para AWS Lambda
export const handler = async (event: any, context: any) => {
  if (!cachedHandler) {
    const fastifyApp = await bootstrap();
    cachedHandler = awsLambdaFastify(fastifyApp);
  }
  return cachedHandler(event, context);
};

// Arranque local (solo cuando ejecutas node dist/src/main.js fuera de Lambda)
if (require.main === module) {
  (async () => {
    const fastifyApp = await bootstrap();
    await fastifyApp.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 App corriendo en http://localhost:3000');
  })();
}
