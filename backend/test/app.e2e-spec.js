"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("../src/app.module");
const superheroes_service_1 = require("../src/superheroes/superheroes.service");
describe('SuperheroesController (e2e)', () => {
    let app;
    let superheroesService;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
        superheroesService = app.get(superheroes_service_1.SuperheroesService);
    });
    beforeEach(() => {
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
        await request(app.getHttpServer())
            .post('/superheroes')
            .send({ name: 'Batman', superpower: 'Intelligence', humility: 7 })
            .expect(201);
        await request(app.getHttpServer())
            .post('/superheroes')
            .send({ name: 'Superman', superpower: 'Super Strength', humility: 5 })
            .expect(201);
        const response = await request(app.getHttpServer()).get('/superheroes').expect(200);
        expect(response.body).toHaveLength(2);
        expect(response.body).toEqual([
            expect.objectContaining({ name: 'Batman', superpower: 'Intelligence', humilityScore: 7 }),
            expect.objectContaining({ name: 'Superman', superpower: 'Super Strength', humilityScore: 5 }),
        ]);
    });
});
//# sourceMappingURL=app.e2e-spec.js.map