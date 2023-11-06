import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: "localhost", //"db.tpjjacgapstyjpzkibag.supabase.co",
        port: 5432,
        database: "finnapp", // "postgres",
        username: "postgres",
        password: "ifpi",  //"ZUhINS5TMiPX7y9b",
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

