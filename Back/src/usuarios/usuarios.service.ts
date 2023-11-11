import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { EntityManager, IsNull, Not } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/auth.constants';
import { jwtDecodeUser } from 'src/auth/jwt.strategy';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly entityManager: EntityManager,
    private jwtService: JwtService
  ) { }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuario = new Usuario({
      ...createUsuarioDto,
      saldo: 0
    });
    await this.entityManager.save(usuario);
    return usuario;
  }

  async findOneByEmail(email: string): Promise<Usuario | null> {
    if (!email) {
      throw new Error('Email não fornecido');
    }

    const usuario = await this.entityManager.findOneBy<Usuario>(
      Usuario, {
      email
    }).catch((e) => {
      console.error(e);
      return null;
    });

    return usuario;
  }

  async update(updateUsuarioDto: UpdateUsuarioDto): Promise<string> {
    if (!updateUsuarioDto.email && !updateUsuarioDto.senha && !updateUsuarioDto.nome) {
      throw new NotFoundException('Nenhum campo foi alterado');
    }

    const { id } = await this.getUserFromtoken(updateUsuarioDto.access_token)

    const usuario = await this.entityManager.findOne(
      Usuario, {
      where: { id }
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    if (updateUsuarioDto.email) {
      usuario.email = updateUsuarioDto.email;
    }

    if (updateUsuarioDto.nome) {
      usuario.nome = updateUsuarioDto.nome;
    }

    if (updateUsuarioDto.senha) {
      usuario.senha = updateUsuarioDto.senha;
    }
    const { access_token } = await this.gerarToken(usuario);

    await this.entityManager.save(usuario);
    return access_token;
  }

  private async gerarToken(payload: Usuario) {
    return {
      access_token: this.jwtService.sign(
        {
          email: payload.email,
          senha: payload.senha
        },
        {
          secret: jwtConstants.secret,
          expiresIn: '50s',
        },
      ),
    };
  }

  remove(access_token: string) {
    return this.entityManager.delete(
      Usuario, { JWT: access_token }
    );
  }

  async getSaldo(access_token: string) {
    const usuario = await this.getUserFromtoken(access_token)
    return usuario.saldo
  }

  async me(access_token: string) {
    const usuario = await this.getUserFromtoken(access_token)
    return usuario
  }

  private getUserFromtoken(token: string): Promise<Usuario> {
    const data = this.jwtService.decode(token) as jwtDecodeUser

    const usuario = this.entityManager.findOneBy(
      Usuario,
      {
        email: data.email
      })

    if (!usuario) {
      console.log('Usuário não encontrado');
      throw new NotFoundException('Usuário não encontrado'); // 404
    }

    return usuario
  }
}
