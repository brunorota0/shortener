import { Test, TestingModule } from '@nestjs/testing';
import { ShortenUrlController } from '../shortenUrl.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDbConfig } from 'src/config/database';
import { INestApplication } from '@nestjs/common';
import { ShortenUrlModule } from '../shortenUrl.module';
import supertest from 'supertest';
import { ShortenUrlDto } from 'src/types/types';
import { clearDB } from 'src/helpers/testingDatabase.helper';

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
    const payload: ShortenUrlDto = {
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
    const payload: ShortenUrlDto = {
      longUrl: 'https://www.google.com'
    }

    await supertest.agent(app.getHttpServer())
      .post('/shorten')
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);
  })

  it('Custom short url should be created', async () => {
    const payload: ShortenUrlDto = {
      longUrl: 'https://www.google.com',
      customCode: 'myCustomCode'
    }

    await supertest.agent(app.getHttpServer())
      .post('/shorten')
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);
  })

  it('Short url with custom expiration should be created', async () => {
    const payload: ShortenUrlDto = {
      longUrl: 'https://www.google.com',
      expiresIn: '1s'
    }

    await supertest.agent(app.getHttpServer())
      .post('/shorten')
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);
  })

  it('Custom duplicated short url shouldn`t be created', async () => {
    const payload1: ShortenUrlDto = {
      longUrl: 'https://www.google.com',
      customCode: 'myCode'
    }

    await supertest.agent(app.getHttpServer())
      .post('/shorten')
      .send(payload1)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);

    const payload2: ShortenUrlDto = {
      longUrl: 'https://www.google.com',
      customCode: 'myCode'
    }

    await supertest.agent(app.getHttpServer())
      .post('/shorten')
      .send(payload2)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);
  })

  afterEach(async () => {
    await clearDB();
  })

  afterAll(async () => {
    await app.close();
  })
});