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

  // En Lambda NO hacemos listen; solo inicializamos
  await app.init();

  // Devolvemos la instancia Fastify
  return app.getHttpAdapter().getInstance();
}

// Handler para AWS Lambda
export const handler = async (event: any, context: any) => {
  if (!cachedHandler) {
    const fastifyApp = await bootstrap();
    // Cast a any para evitar choque de tipos entre dos copias de fastify
    cachedHandler = awsLambdaFastify(fastifyApp as any);
  }
  return cachedHandler(event, context);
};

// Arranque local (solo cuando se ejecuta fuera de Lambda)
if (require.main === module) {
  (async () => {
    const fastifyApp = await bootstrap();
    await fastifyApp.listen({ port: 3000, host: '0.0.0.0' });
    // eslint-disable-next-line no-console
    console.log('🚀 App corriendo en http://localhost:3000');
  })();
}
