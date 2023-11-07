import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const host = process.env.DB_MODE === 'local' ? process.env.DBHOST_LOCAL : process.env.DBHOST_DEV;
const database = process.env.DB_MODE === 'local' ? process.env.DB_DATABASE_LOCAL : process.env.DB_DATABASE_DEV;
const password = process.env.DB_MODE === 'local' ? process.env.DB_PASSWORD_LOCAL : process.env.DB_PASSWORD_DEV;

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: host,
        port: 5432,
        database: database,
        username: "postgres",
        password: password,
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule { }

/* 
docker run --name pg-server -e POSTGRES_PASSWORD=ifpi -e PGPASSWORD=ifpi -e POSTGRES_DB=finnapp -p 5432:5432 -d postgres
*/

