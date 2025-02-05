import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('SuperheroesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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

  it('POST /superheroes - should return 400 if a required field is missing', async () => {
    await request(app.getHttpServer())
        .post('/superheroes')
        .send({ name: 'Superman' }) // Missing fields
        .expect(400);
  });

  it('GET /superheroes - should return an array', async () => {
    const response = await request(app.getHttpServer())
        .get('/superheroes')
        .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /invalid-route - should return 404 for a non-existent route', async () => {
    await request(app.getHttpServer())
        .get('/invalid-route')
        .expect(404);
  });

  it('GET /superheroes - should return superheroes sorted by humilityScore', async () => {
    // Add multiple superheroes with different humility scores
    await request(app.getHttpServer()).post('/superheroes').send({ name: 'Hero A', superpower: 'Speed', humility: 9 });
    await request(app.getHttpServer()).post('/superheroes').send({ name: 'Hero B', superpower: 'Strength', humility: 5 });
    await request(app.getHttpServer()).post('/superheroes').send({ name: 'Hero C', superpower: 'Flight', humility: 7 });

    const response = await request(app.getHttpServer()).get('/superheroes').expect(200);

    const heroes = response.body;
    expect(Array.isArray(heroes)).toBe(true);
    expect(heroes.length).toBeGreaterThanOrEqual(3);

    // Ensure the list is sorted by humilityScore in ascending order
    for (let i = 0; i < heroes.length - 1; i++) {
      expect(heroes[i].humilityScore).toBeLessThanOrEqual(heroes[i + 1].humilityScore);
    }
  });
});
