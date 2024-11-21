import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './common/config/env.config';
import { JoiValidationSchema } from './common/config/joi.validation';

@Module({
  /**
   * La propiedad `imports` permite agregar otros módulos o configuraciones 
   * necesarias para que este módulo funcione correctamente.
   */
  imports: [
    /**
     * Configuramos el módulo `ConfigModule` para cargar las variables de entorno
     */
    ConfigModule.forRoot({
      load: [envConfig],
      validationSchema: JoiValidationSchema // -> Se agrega el esquema de validación
    }),
    /**
     * Configuramos `ServeStaticModule` para servir archivos estáticos.
     * Aquí, `rootPath` define el directorio desde donde se servirán los archivos.
     * En este caso, apunta a una carpeta llamada `public` que está en el nivel superior del proyecto.
     */
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    /**
     * Se realiza la conexión a la base de datos de MongoDB
     */
    MongooseModule.forRoot( envConfig().mongodb, {
      dbName: 'nestjs-pokemons',
    } ),
    /**
     * Importamos el módulo `PokemonModule` que contiene toda la lógica y configuración
     * necesaria para manejar las rutas y operaciones relacionadas con los pokemones.
     */
    PokemonModule,
    CommonModule,
    SeedModule
  ],
})
export class AppModule {}
