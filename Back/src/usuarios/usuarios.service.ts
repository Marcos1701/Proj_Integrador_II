import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { EntityManager } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/auth.constants';

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
  }

  findOneByEmail(email: string): Promise<Usuario | null> {
    return this.entityManager.findOne(
      Usuario, {
      where: { email }
    });
  }

  async update(updateUsuarioDto: UpdateUsuarioDto) {
    if (!updateUsuarioDto.email && !updateUsuarioDto.senha && !updateUsuarioDto.nome) {
      throw new NotFoundException('Nenhum campo foi alterado');
    }
    const usuario = await this.entityManager.findOne(
      Usuario, {
      where: { JWT: updateUsuarioDto.JWT }
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
    usuario.JWT = access_token;

    await this.entityManager.save(usuario);
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

  remove(JWT: string) {
    return this.entityManager.delete(
      Usuario, { JWT }
    );
  }
}
