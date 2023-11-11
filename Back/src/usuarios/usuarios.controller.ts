import { Controller, Get, Body, Patch, Delete, UseGuards, Param, Headers } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Usuario } from './entities/usuario.entity';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService
  ) { }

  @ApiResponse({
    status: 200,
    description: 'O usuário foi alterado com sucesso',
    content: {
      Body: {
        schema: {
          type: 'object',
          properties: {
            nome: {
              type: 'string',
              description: 'The name of the user.',
              example: 'Fulano',
            },
            email: {
              type: 'string',
              description: 'The email of the user.',
              example: 'AiiinnnzedaManga123@gmail.com',
            },
            senha: {
              type: 'string',
              description: 'The password of the user.',
              example: '123456789',
            },
            saldo: {
              type: 'number',
              description: 'The balance of the user.',
              example: 0,
            },
          },
        },
      }
    }
  }) // retorna o usuario alterado

  @Patch() // retorna o status code 200
  update(@Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(updateUsuarioDto);
  }

  @ApiBody({
    type: 'object',
    description: 'JWT do usuário',
    schema: {
      title: 'JWT',
      type: 'string',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkFpaWlubnplZGFNYW5nYTEyM0BnbWFpbC5jb20iLCJpYXQiOjE2MzI1NjQ0NzIsImV4cCI6'
    }
  })

  @Delete()
  remove(@Body() JWT: string) {
    return this.usuariosService.remove(JWT);
  }

  @ApiResponse({
    status: 200,
    description: 'O usuário foi encontrado com sucesso',
    content: {
      Body: {
        schema: {
          type: 'object',
          properties: {
            nome: {
              type: 'string',
              description: 'The name of the user.',
              example: 'Fulano',
            },
            email: {
              type: 'string',
              description: 'The email of the user.',
              example: 'marcosneiva123321@gmail.com',
            },
            senha: {
              type: 'string',
              description: 'The password of the user.',
              example: '123456789',
            },
            saldo: {
              type: 'number',
              description: 'The balance of the user.',
              example: 0,
            },
          },
        },
      }
    }
  }) // retorna o usuario encontrado
  @Get('perfil')
  perfil(@Body() { email }: { email: string }) {
    return this.usuariosService.findOneByEmail(email);
  }

  @ApiResponse({
    status: 200,
    description: 'O usuário foi encontrado com sucesso',
    type: Usuario,
    schema: {
      example: {
        id: 'xxxx-yyyy-zzzz-xxxx-yyyy-zzzz',
        nome: 'Fulano',
        email: 'zedamanga123@gmail.com',
        senha: '123456789',
        saldo: 0,
      }
    }
  }) // retorna o usuario encontrado
  @Get('me')
  me(@Headers('Authorization') access_token: string) {
    return this.usuariosService.me(access_token);
  }

  @Get('saldo')
  getSaldo(@Headers('Authorization') access_token: string) {
    return this.usuariosService.getSaldo(access_token);
  }

}
