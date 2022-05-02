import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

export const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_DB_URL,
  synchronize: true,
  keepConnectionAlive: true,
  ssl: process.env.DB_LOCAL === 'true' ? false : {
    requestCert: true,
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.join(__dirname, 'certs/rds-combined-ca-bundle.cer')).toString()
  },
  entities: [`${__dirname}/../**/*.entity.{ts,js}`],
  namingStrategy: new SnakeNamingStrategy()
};

export const testDbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.TEST_POSTGRES_DB_URL,
  synchronize: true,
  keepConnectionAlive: true,
  ssl: process.env.DB_LOCAL === 'true' ? false : {
    rejectUnauthorized: false
  },
  entities: [`${__dirname}/../**/*.entity.{ts,js}`],
  namingStrategy: new SnakeNamingStrategy()
};