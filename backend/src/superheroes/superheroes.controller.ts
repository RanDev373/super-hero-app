import { Controller, Get, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { SuperheroesService } from './superheroes.service';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { SuperheroResponseDto } from './dto/superhero-response.dto';
import { appLogger } from '../common/logger';


@Controller('superheroes')
export class SuperheroesController {
    constructor(private readonly superheroesService: SuperheroesService) {}

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    create(@Body() createSuperheroDto: CreateSuperheroDto): SuperheroResponseDto {
        appLogger.log(`Received request to create superhero: ${createSuperheroDto.name}`);

        return this.superheroesService.create(createSuperheroDto);
    }

    @Get()
    findAll(): SuperheroResponseDto[] {
        appLogger.log('Received request to fetch all superheroes');

        const heroes = this.superheroesService.findAll();

        appLogger.log(`Returning ${heroes.length} superheroes`);
        return heroes;
    }
}