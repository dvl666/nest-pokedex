import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    // Se inyecta el servicio de configuracion para obtener el valor de default_limit
    private readonly configService: ConfigService
  ) {
    // Se obtiene el valor de default_limit del archivo .env
    this.defaultLimit = configService.get<number>('default_limit');
  }

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

  /**
   * Aqui metemos la logica de paginacion, limit y offset son parametros opcionales que se pueden pasar en la url
   */
  async findAll( paginationDto: PaginationDto ): Promise<Pokemon[]> {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    return await this.pokemonModel.find()
      .limit( limit )
      .skip( offset )
      .sort({ no: 1 })
      .select( '_id name no' ) // -> tambien funcionaria como .select('-__v') para no mostrar el campo __v
  }

  async findOne(term: string): Promise<Pokemon> {
    /**
     * Se usa un operador ternario (key) el cual sera _id si el termino es un objectId valido, no si es un numero y name si es un string
     * posteriormente se realiza la consulta a la base de datos con el key correspondiente, en la cual tambien se usa un operador ternario
     * para saber si el key es no, en cuyo caso se convierte el termino a un numero
     */
    const key = isValidObjectId(term) ? '_id' : !isNaN(+term) ? 'no' : 'name'; 
    const pokemon: Pokemon = await this.pokemonModel.findOne({
      [key]: key === 'no' ? +term : term                                                
    });
    if ( !pokemon ) throw new NotFoundException(`Pokemon with id/name/number ${term} not found`);
    return pokemon;
  
  }

  /**
   * Actualiza un pokemon por id o nombre, si el nombre es un string se convierte a minusculas
   */
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

  async remove(id: string) {
      /**
       * Elimina un pokemon por id y verifica si se elimino algun registro, si no se elimino ningun registro envia un mensaje de 
       * que no se encontró el pokemon
       */
      const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
      if ( deletedCount === 0 ) throw new NotFoundException(`Pokemon with id ${id} not found`);
      return `Se a eliminado el pokemon con id: ${id}`;

  }

  async createMany(createPokemonsDto: CreatePokemonDto[]): Promise<Pokemon[]> {
    await this.pokemonModel.deleteMany({});
    try {
      const pokemons = await this.pokemonModel.insertMany( createPokemonsDto );
      return pokemons;
    } catch (error) {
      this.validateDuplicatePokemons(error);
    }
  }

  validateDuplicatePokemon(error: any) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Pokemon already exist in db ${ JSON.stringify(error.keyValue) }`);
     }
     throw new InternalServerErrorException(`Error creating pokemon, please check server logs`);
  }

  validateDuplicatePokemons(error: any) {
    let errIndex = error.message.indexOf(`{`);
    let err = error.message.slice(errIndex, error.message.length);  
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Pokemon already exist in db with -> ${ err }`);
     }
     throw new InternalServerErrorException(`Error creating pokemon, please check server logs`);
  }

}


