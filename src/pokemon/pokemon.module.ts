import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { 
        /**
         * Pokemon.name no viene de la clase pokemon, sino que proviene de Document
         */
        name: Pokemon.name, 
        schema: PokemonSchema 
      }
    ])
  ],
  exports: [PokemonService]
})
export class PokemonModule {}
