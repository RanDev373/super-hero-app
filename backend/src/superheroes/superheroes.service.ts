import { Injectable } from '@nestjs/common';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { SuperheroEntity } from './entities/superhero.entity';
import { SuperheroResponseDto } from './dto/superhero-response.dto';
import { appLogger } from '../common/logger';

@Injectable()
export class SuperheroesService {
    private superheroes: SuperheroEntity[] = [];
    private idCounter = 1;

    create(createSuperheroDto: CreateSuperheroDto): SuperheroResponseDto {
        appLogger.log(`Creating superhero: ${createSuperheroDto.name}`);

        const newSuperhero: SuperheroEntity = {
            id: this.idCounter++,
            name: createSuperheroDto.name,
            superpower: createSuperheroDto.superpower,
            humilityScore: createSuperheroDto.humility,
        };

        this.superheroes.push(newSuperhero);

        appLogger.log(`Superhero created with ID: ${newSuperhero.id}`);

        return {
            id: newSuperhero.id,
            name: newSuperhero.name,
            superpower: newSuperhero.superpower,
            humilityScore: newSuperhero.humilityScore,
        };
    }

    findAll(): SuperheroResponseDto[] {
        appLogger.log('Fetching all superheroes');

        return this.superheroes.map((hero) => ({
            id: hero.id,
            name: hero.name,
            superpower: hero.superpower,
            humilityScore: hero.humilityScore,
        }));
    }
}
