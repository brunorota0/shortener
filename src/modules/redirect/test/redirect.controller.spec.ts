import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDbConfig } from 'src/config/database';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from 'src/app.module';
import { RedirectController } from '../redirect.controller';
import { ShortenUrlController } from 'src/modules/shortenUrl/shortenUrl.controller';
import { RedirectModule } from '../redirect.module';
import { ShortenUrlModule } from 'src/modules/shortenUrl/shortenUrl.module';

let app: INestApplication;

describe('ShortenUrlController', () => {
  let shortenUrlController: ShortenUrlController;
  let redirectController: RedirectController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testDbConfig),
        ShortenUrlModule,
        RedirectModule,
      ]
    }).compile();

    app = module.createNestApplication();
    await app.init();

    shortenUrlController = module.get(ShortenUrlController);
    redirectController = module.get(RedirectController)
  })

  it('Controllers should be defined', () => {
    expect(shortenUrlController).toBeDefined();
    expect(redirectController).toBeDefined();
  })

  it('Url code not founded', async () => {
    const code = 'test';

    await supertest.agent(app.getHttpServer())
      .get(`/${code}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404);
  })

  it('Entire flow tested', async () => {
    const payload = {
      longUrl: 'https://www.google.com'
    }

    // Create short url
    const { body: { data } } = await supertest.agent(app.getHttpServer())
      .post('/shorten')
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);

    const code = data.code;

    // Redirect
    await supertest.agent(app.getHttpServer())
      .get(`/${code}`)
      .set('Accept', 'application/json')
      .expect(302);

  })

  afterAll(async () => {
    await app.close();
  })
});