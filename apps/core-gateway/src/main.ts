import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ZodValidationPipe } from './zod.pipe';
import serverless from 'serverless-http';

let cachedHandler: any;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(new ZodValidationPipe());

  // ⚠️ En Lambda NO se hace `listen`, solo init
  await app.init();

  return app.getHttpAdapter().getInstance();
}

// 👇 handler usado en Lambda
export const handler = async (event: any, context: any) => {
  if (!cachedHandler) {
    const fastifyApp = await bootstrap();
    cachedHandler = serverless(fastifyApp);
  }
  return cachedHandler(event, context);
};

// ⚠️ Solo si se ejecuta en local, arranca en puerto 3000
if (require.main === module) {
  bootstrap().then(app =>
    app.listen(3000, '0.0.0.0').then(() => {
      console.log('🚀 App corriendo en http://localhost:3000');
    }),
  );
}
