import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: process.env.DBHOST_DEV,
        port: 5432,
        database: process.env.DB_DATABASE_DEV,
        username: "postgres",
        password: process.env.DB_PASSWORD_DEV,
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule { }

/* 
docker run --name pg-server -e POSTGRES_PASSWORD=ifpi -e PGPASSWORD=ifpi -p 5432:5432 -d postgres
*/

