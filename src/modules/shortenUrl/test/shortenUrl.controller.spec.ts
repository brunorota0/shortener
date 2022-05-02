import { Test, TestingModule } from '@nestjs/testing';
import { ShortenUrlController } from '../shortenUrl.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDbConfig } from 'src/config/database';
import { INestApplication } from '@nestjs/common';
import { ShortenUrlModule } from '../shortenUrl.module';
import supertest from 'supertest';

let app: INestApplication;

describe('ShortenUrlController', () => {
  let controller: ShortenUrlController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ShortenUrlModule,
        TypeOrmModule.forRoot(testDbConfig),
      ]
    }).compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get(ShortenUrlController);
  })

  it('Controller should be defined', () => {
    expect(controller).toBeDefined();
  })

  it('Bad url shouldn`t be created', async () => {
    const payload = {
      longUrl: 'test'
    }

    await supertest.agent(app.getHttpServer())
      .post('/shorten')
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);
  })

  it('Short url should be created', async () => {
    const payload = {
      longUrl: 'https://www.google.com'
    }

    await supertest.agent(app.getHttpServer())
      .post('/shorten')
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);
  })

  afterAll(async () => {
    await app.close();
  })
});