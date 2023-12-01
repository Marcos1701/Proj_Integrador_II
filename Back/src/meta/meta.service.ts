import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { EntityManager } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Metasorderby, Usuario } from 'src/usuarios/entities/usuario.entity';
import { jwtDecodeUser } from 'src/auth/jwt.strategy';
import { Meta } from './entities/meta.entity';

@Injectable()
export class MetaService {

  constructor(
    private readonly entityManager: EntityManager,
    private readonly jwtService: JwtService,
  ) { }

  async create(access_token: string, createMetaDto: CreateMetaDto) {
    const usuario: Usuario = await this.getUserFromtoken(access_token)

    const meta = this.entityManager.create(
      'Meta',
      {
        ...createMetaDto,
        usuario
      }
    )

    await this.entityManager.save(meta)

    return meta
  }

  async findAll(access_token: string, orderby?: Metasorderby, order: 'ASC' | 'DESC' = 'ASC', search?: string) {
    const usuario: Usuario = await this.getUserFromtoken(access_token)

    return usuario.getMetas(order, orderby, search);
  }

  async findOne(access_token: string, id: string) {
    const usuario: Usuario = await this.getUserFromtoken(access_token)

    const meta = usuario.metas.find(meta => meta.id === id)

    if (!meta) {
      throw new NotFoundException('Meta não encontrada'); // 404
    }
    meta.atualizarProgresso();
    return meta
  }

  async update(access_token: string, id: string, updateMetaDto: UpdateMetaDto) {
    const usuario: Usuario = await this.getUserFromtoken(access_token)

    const meta = usuario.metas.find(meta => meta.id === id)

    if (!meta) {
      throw new NotFoundException('Meta não encontrada'); // 404
    }

    if (Object.keys(updateMetaDto).filter(key => updateMetaDto[key] == meta[key]).length === Object.keys(updateMetaDto).length) {
      throw new BadRequestException('Nenhuma alteração foi feita'); // 400
    }

    const result = await this.entityManager.update(
      Meta,
      {
        id
      },
      updateMetaDto
    )

    if (!result || result.affected === 0) {
      throw new BadRequestException('Nenhuma alteração foi feita'); // 400
    }

    return result
  }

  async remove(access_token: string, id: string) {
    const usuario: Usuario = await this.getUserFromtoken(access_token)

    const meta = usuario.metas.find(meta => meta.id === id)

    if (!meta) {
      throw new NotFoundException('Meta não encontrada'); // 404
    }

    return this.entityManager.remove(meta)
  }

  async AdicionarValor(access_token: string, id: string, valor: number) {
    const usuario: Usuario = await this.getUserFromtoken(access_token)

    const meta = usuario.metas.find(meta => meta.id === id)

    if (!meta) {
      throw new NotFoundException('Meta não encontrada'); // 404
    }

    if (valor <= meta.valorAtual) {
      throw new BadRequestException('O valor a ser adicionado deve ser maior que o valor atual'); // 400
    }
    if (valor > meta.valor) {
      throw new BadRequestException('O valor a ser adicionado deve ser menor ou igual ao valor da meta'); // 400
    }

    const result = await this.entityManager.update(
      Meta,
      {
        id
      },
      {
        valorAtual: valor
      }
    )

    if (!result || result.affected === 0) {
      throw new BadRequestException('Nenhuma alteração foi feita'); // 400
    }
    meta.valorAtual = valor
    meta.atualizarProgresso();
    return meta
  }

  private getUserFromtoken(token: string): Promise<Usuario> {
    const data = this.jwtService.decode(token) as jwtDecodeUser

    const usuario = this.entityManager.findOne(
      Usuario,
      {
        where: {
          id: data.id
        },
        relations: {
          metas: true
        }
      })

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado'); // 404
    }

    return usuario
  }
}
