import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { EntityManager } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/auth.constants';
import { jwtDecodeUser } from 'src/auth/jwt.strategy';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly entityManager: EntityManager,
    private jwtService: JwtService
  ) { }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuario = await this.entityManager.insert<Usuario>(
      Usuario,
      {
        ...createUsuarioDto
      }
    )

    if (usuario.identifiers.length === 0) {
      throw new BadRequestException(usuario.raw.message ? usuario.raw.message : 'Erro ao criar usuário');
    }
    //retorna o usuário criado
    return await this.entityManager.findOne(Usuario, usuario.identifiers[0].id)
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

    if (Object.keys(updateUsuarioDto).filter(key => updateUsuarioDto[key] == usuario[key]).length === Object.keys(updateUsuarioDto).length) {
      throw new NotFoundException('Nenhum campo foi alterado');
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

    await this.entityManager.update(
      Usuario,
      { id },
      { ...usuario }
    )
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
    const { id } = this.jwtService.decode(access_token) as jwtDecodeUser
    if (!id) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return this.entityManager.delete(Usuario, { id })
  }

  async getSaldo(access_token: string) {
    const usuario = await this.getUserFromtoken(access_token, false, true, false)
    const saldo = usuario.saldo
    usuario.atualizarSaldo()
    saldo !== usuario.saldo && await this.entityManager.update(Usuario, { id: usuario.id }, { saldo: usuario.saldo })
    const saldoAnterior = usuario.getSaldoAnterior(new Date().getMonth() === 0 ? 12 : new Date().getMonth() - 1)

    return {
      saldo,
      saldoAnterior
    }
  }

  async me(access_token: string) {
    const usuario = await this.getUserFromtoken(access_token)
    return usuario
  }

  private getUserFromtoken(token: string, metas?: boolean, transacoes?: boolean, categorias?: boolean): Promise<Usuario> {
    const data = this.jwtService.decode(token) as jwtDecodeUser

    if (!data || !data.id) {
      throw new Error('Invalid token');
    }

    const { id } = data;

    const relations = [
      metas ? 'metas' : '',
      transacoes ? 'transacoes' : '',
      transacoes ? 'transacoes.categoria' : '',
      categorias ? 'categorias' : ''
    ].filter(rel => rel !== '')

    const usuario = this.entityManager.findOne<Usuario>(
      Usuario,
      {
        where: { id },
        relations: relations
      }
    )

    if (!usuario) {
      // console.log('Usuário não encontrado');
      throw new NotFoundException('Usuário não encontrado'); // 404
    }

    return usuario
  }
}
