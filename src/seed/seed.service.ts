import { HttpModule, HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {

    constructor(
        private readonly http: HttpService
    ) {}


    async executeSeed() {
        const {data} = await this.http.axiosRef.get('https://pokeapi.co/api/v2/pokemon?limit=650')
        console.log('Seed executed');
        return data;
    }

}
