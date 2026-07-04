import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Segurança de Cabeçalhos HTTP
  app.use(helmet());
  
  app.enableCors(); // Permite requisições do frontend
  
  // Validação Global de Dados e Proteção contra Mass Assignment
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Converte tipos automaticamente baseados nos DTOs
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
