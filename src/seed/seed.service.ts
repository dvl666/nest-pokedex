import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { PokemonService } from 'src/pokemon/pokemon.service';

@Injectable()
export class SeedService {

    /** 
     * Se importan los servicios necesarios para la ejecución del seed
     */
    constructor(
        private readonly http: HttpService,
        private readonly pokemonService: PokemonService // -> Se importa el servicio de Pokemon para utilizar sus métodos
    ) {}


    async executeSeed(): Promise<CreatePokemonDto[]> {
        let newPokemons: CreatePokemonDto[] = []; // -> let debido a que se reasignará el valor de la variable
        const { data } = await this.http.axiosRef.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=20'); // -> Se obtienen los datos de la API
        
        /**
         * Por cada pokemon se obtiene el nombre y el número de la URL, finalmente se almacenan en el array declarado anteriormente
         */
        data.results.forEach(({ name, url }) => {
            name = name.toLowerCase();
            const segments = url.split('/');
            const no:number = +segments[segments.length - 2];
            newPokemons.push({ name, no });
        })
        
        newPokemons = await this.pokemonService.createMany(newPokemons); // -> Se crean los pokemones en la base de datos utilizando el metodo del pokemonService
        console.log('Seed executed');
        return newPokemons;
    }

}
