import { Test, TestingModule } from '@nestjs/testing';
import { SuperheroesService } from './superheroes.service';
import { CreateSuperheroDto } from './dto/create-superhero.dto';

describe('SuperheroesService', () => {
  let service: SuperheroesService;

  beforeEach(() => {
    service = new SuperheroesService();
  });

  it('should create a superhero', () => {
    const dto: CreateSuperheroDto = { name: 'Batman', superpower: 'Intelligence', humility: 7 };
    const result = service.create(dto);

    expect(result).toHaveProperty('id');
    expect(result.name).toBe('Batman');
  });

  it('should return all superheroes', () => {
    service.create({ name: 'Batman', superpower: 'Intelligence', humility: 7 });
    service.create({ name: 'Superman', superpower: 'Super Strength', humility: 5 });

    const result = service.findAll();
    expect(result).toHaveLength(2);
  });
});