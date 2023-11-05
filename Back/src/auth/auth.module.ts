import { Module } from '@nestjs/common';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';

@Module({
    imports: [UsuariosModule, JwtModule.register({
        global: true, // para que o módulo seja global, e não apenas local
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '60s' },
    })],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule { }

/* 
Nest can't resolve dependencies of the UsuariosService (UsuarioRepository, EntityManager, ?). Please make sure that the argument dependency at index [2] is available in the UsuariosModule context.

Potential solutions:
- Is UsuariosModule a valid NestJS module?
- If dependency is a provider, is it part of the current UsuariosModule?
- If dependency is exported from a separate @Module, is that module imported within UsuariosModule?
  @Module({
    imports: [ /* the Module containing dependency  ]
})

para resolver o problema, basta importar o módulo que contém o provider que está sendo injetado no módulo que está sendo importado.
que no caso é o módulo de autenticação, que está injetando o módulo de usuários, que por sua vez está injetando o módulo de autenticação.
para resolver o problema, basta importar o módulo de usuários no módulo de autenticação.

*/