import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { error } from 'console';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    /**
     * Se manejo el error de esta forma para realizar la menor cantidad de consultas posibles a la base de datos
     */
    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;
    } catch (error) {
      this.validateDuplicatePokemon(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string): Promise<Pokemon> {
    const key = isValidObjectId(term) ? '_id' : !isNaN(+term) ? 'no' : 'name';   
    const pokemon: Pokemon = await this.pokemonModel.findOne({ 
      [key]: key === 'no' ? +term : term
    });
    if ( !pokemon ) throw new NotFoundException(`Pokemon with id/name/number ${term} not found`);
    return pokemon;
  }

  // if ( !isNaN(+term) ) pokemon = await this.pokemonModel.findOne({ no: +term });
  // if (isValidObjectId(term)) pokemon = await this.pokemonModel.findById({ _id: term });
  // if ( !pokemon ) pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase() });
  // if (!pokemon) throw new NotFoundException(`Pokemon with id/name/number ${term} not found`);

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    const pokemon: Pokemon = await this.findOne(term);
    try {
      await this.pokemonModel.updateOne({_id: pokemon._id}, updatePokemonDto, { new: true } );
      return {
        ...pokemon.toJSON(),
        ...updatePokemonDto
      };
    } catch (error) {
      this.validateDuplicatePokemon(error);
    }
  }

  remove(id: string) {
    
    return `This action removes a #${id} pokemon`;
  }

  validateDuplicatePokemon(error: any) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Pokemon already exist in db ${ JSON.stringify(error.keyValue) }`);
     }
     console.log( error );
     throw new InternalServerErrorException(`Error creating pokemon, please check server logs`);
  }

}


