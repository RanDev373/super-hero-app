import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

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
  });

  it('POST 2 superheroes and GET all superheroes', async () => {
    await request(app.getHttpServer()).post('/superheroes').send({ name: 'Batman', superpower: 'Intelligence', humility: 7 });
    await request(app.getHttpServer()).post('/superheroes').send({ name: 'Superman', superpower: 'Super Strength', humility: 5 });

    const response = await request(app.getHttpServer()).get('/superheroes').expect(200);
    expect(response.body).toHaveLength(2);
  });
});
