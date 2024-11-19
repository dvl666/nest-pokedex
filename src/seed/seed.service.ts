import { HttpModule, HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

    constructor(
        private readonly http: HttpService
    ) {}


    async executeSeed() {
        const { data } = await this.http.axiosRef.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=20');
        console.log('Seed executed');

        data.results.forEach(({ name, url }) => {
            const segments = url.split('/');
            const no:number = +segments[segments.length - 2];
            console.log({ name, no });
        })

        return data.results;
    }

}
