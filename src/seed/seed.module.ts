import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { HttpModule } from '@nestjs/axios';
import { PokemonModule } from 'src/pokemon/pokemon.module';

/**
 * Se importan los módulos necesarios para la ejecución del seed como el HttpModule 
 * y el PokemonModule para posteriormente usar su servicio
 */

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    HttpModule,
    PokemonModule
  ]
})
export class SeedModule {}
