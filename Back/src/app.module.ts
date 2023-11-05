import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriasModule } from './categorias/categorias.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsuariosModule } from './usuarios/usuarios.module';
import { TransacoesModule } from './transacoes/transacoes.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UsuariosController } from './usuarios/usuarios.controller';
import { TransacoesController } from './transacoes/transacoes.controller';
import { CategoriasController } from './categorias/categorias.controller';
import { UsuariosService } from './usuarios/usuarios.service';
import { CategoriasService } from './categorias/categorias.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CategoriasModule,
    DatabaseModule,
    TransacoesModule,
    AuthModule,
    UsuariosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
