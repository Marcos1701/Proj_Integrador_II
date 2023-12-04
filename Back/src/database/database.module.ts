import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import * as path from "path";

const host = process.env.DB_MODE === 'local' ? process.env.DBHOST_LOCAL : process.env.DBHOST_DEV;
const database = process.env.DB_MODE === 'local' ? process.env.DB_DATABASE_LOCAL : process.env.DB_DATABASE_DEV;
const password = process.env.DB_MODE === 'local' ? process.env.DB_PASSWORD_LOCAL : process.env.DB_PASSWORD_DEV;

const getFileName = () => {
  const stack = new Error().stack;
  const callerFile = stack.split("\n")[3];
  const fileName = callerFile.trim().replace(/^at\s+/g, "").split(" ")[0];
  return path.basename(fileName);
}; // para ver os arquivos que executam as querys no console


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
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true, // para ver as querys no console
        logger: "file",
        migrationsRun: true,
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        cli: {
          migrationsDir: 'src/migrations',
        },
        ssl: process.env.DB_MODE === 'local' ? false : true,
        extra: process.env.DB_MODE === 'local' ? undefined : {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule { }

/* 
docker run --name pg-server -e POSTGRES_PASSWORD=ifpi -e PGPASSWORD=ifpi -e POSTGRES_DB=finnapp -p 5432:5432 -d postgres
*/

