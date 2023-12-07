import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriasModule } from './categorias/categorias.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsuariosModule } from './usuarios/usuarios.module';
import { TransacoesModule } from './transacoes/transacoes.module';
import { AuthModule } from './auth/auth.module';
import { MetaModule } from './meta/meta.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: true
    }),
    CategoriasModule,
    DatabaseModule,
    TransacoesModule,
    AuthModule,
    UsuariosModule,
    MetaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
