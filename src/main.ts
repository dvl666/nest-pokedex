import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'environment';
import { envConfig } from './common/config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix for all routes
  app.setGlobalPrefix('api/v2');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      /**
       * transform: true -> Con esto se habilita la transformacion de los datos, por ejemplo si se recibe un string
       * enableImplicitConversion: true -> Con esto se habilita la conversion implicita de los tipos de datos, por ejemplo
       * si se espera un numero y se recibe un string 
       */
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      }
    }),
  );
  
  await app.listen( envConfig().port );
  console.log(`Application is running on port -----> ${ envConfig().port }`);
}
bootstrap();
