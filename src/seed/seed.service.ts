import { HttpModule, HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { PokemonService } from 'src/pokemon/pokemon.service';

@Injectable()
export class SeedService {

    constructor(
        private readonly http: HttpService,
        private readonly pokemonService: PokemonService
    ) {}


    async executeSeed() {
        let newPokemons: CreatePokemonDto[] = [];
        const { data } = await this.http.axiosRef.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=20');
        
        data.results.forEach(({ name, url }) => {
            name = name.toLowerCase();
            const segments = url.split('/');
            const no:number = +segments[segments.length - 2];
            newPokemons.push({ name, no });
        })
        
        newPokemons = await this.pokemonService.createMany(newPokemons);
        console.log('Seed executed');
        return newPokemons;
    }

}
