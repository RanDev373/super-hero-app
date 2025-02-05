import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SuperheroesService } from '../src/superheroes/superheroes.service';

describe('SuperheroesController (e2e)', () => {
  let app: INestApplication;
  let superheroesService: SuperheroesService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    superheroesService = app.get(SuperheroesService);
  });

  beforeEach(() => {
    // Reset in-memory database before each test
    superheroesService['superheroes'] = [];
    superheroesService['idCounter'] = 1;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /superheroes - should create a superhero', async () => {
    const response = await request(app.getHttpServer())
        .post('/superheroes')
        .send({ name: 'Batman', superpower: 'Intelligence', humility: 7 })
        .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Batman');
    expect(response.body.superpower).toBe('Intelligence');
    expect(response.body.humilityScore).toBe(7);
  });

  it('POST 2 superheroes and GET all superheroes', async () => {
    // Create first superhero
    await request(app.getHttpServer())
        .post('/superheroes')
        .send({ name: 'Batman', superpower: 'Intelligence', humility: 7 })
        .expect(201);

    // Create second superhero
    await request(app.getHttpServer())
        .post('/superheroes')
        .send({ name: 'Superman', superpower: 'Super Strength', humility: 5 })
        .expect(201);

    // Get all superheroes
    const response = await request(app.getHttpServer()).get('/superheroes').expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual([
      expect.objectContaining({ name: 'Batman', superpower: 'Intelligence', humilityScore: 7 }),
      expect.objectContaining({ name: 'Superman', superpower: 'Super Strength', humilityScore: 5 }),
    ]);
  });
});
