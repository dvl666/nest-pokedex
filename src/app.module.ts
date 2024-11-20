import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { config } from 'environment';

@Module({
  /**
   * La propiedad `imports` permite agregar otros módulos o configuraciones 
   * necesarias para que este módulo funcione correctamente.
   */
  imports: [
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
    MongooseModule.forRoot(config.MONGODB),

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
