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
  await app.init(); // en Lambda NO listen
  return app.getHttpAdapter().getInstance();
}

export const handler = async (event: any, context: any) => {
  if (!cachedHandler) {
    const fastifyApp = await bootstrap();
    // Cast a any para evitar choque de tipos en compilación
    cachedHandler = awsLambdaFastify(fastifyApp as any);
  }
  return cachedHandler(event, context);
};

if (require.main === module) {
  (async () => {
    const fastifyApp = await bootstrap();
    await fastifyApp.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 App corriendo en http://localhost:3000');
  })();
}
