import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
//import { PokemonService } from '../pokemon/pokemon.service';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  constructor( 
    //private readonly pokemonService: PokemonService
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter
    ) {
  }

  private readonly axios: AxiosInstance = axios;

  async executeSeed(){

    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=350');

    const pokemonsToInsert: { name: string, no: number }[]= [];

    data.results.forEach( async ({ name, url }) => {

      const segments = url.split('/');
      const no: number = +segments[ segments.length - 2 ];
   //   const pokemon = await this.pokemonModel.create({ name, no});
//      this.pokemonService.create({ name, no });
      pokemonsToInsert.push({ name, no });
    });

    await this.pokemonModel.insertMany( pokemonsToInsert );

    return 'Seed executed';
  }
}
