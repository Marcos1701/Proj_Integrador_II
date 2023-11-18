import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { EntityManager } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Metasorderby, Usuario } from 'src/usuarios/entities/usuario.entity';
import { jwtDecodeUser } from 'src/auth/jwt.strategy';

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
      console.log('Meta não encontrada');
      throw new NotFoundException('Meta não encontrada'); // 404
    }
    return meta
  }

  async update(access_token: string, id: string, updateMetaDto: UpdateMetaDto) {
    const usuario: Usuario = await this.getUserFromtoken(access_token)

    const meta = usuario.metas.find(meta => meta.id === id)

    if (!meta) {
      console.log('Meta não encontrada');
      throw new NotFoundException('Meta não encontrada'); // 404
    }

    if (meta.titulo === updateMetaDto.titulo && meta.descricao === updateMetaDto.descricao && meta.valor === updateMetaDto.valor && meta.dataLimite === updateMetaDto.dataLimite && meta.icon === updateMetaDto.icon) {
      console.log('Nenhuma alteração foi feita');
      throw new BadRequestException('Nenhuma alteração foi feita'); // 400
    }

    return this.entityManager.merge('Meta', meta, updateMetaDto) // merge => faz um merge entre o objeto e o updateMetaDto

  }

  async remove(access_token: string, id: string) {
    const usuario: Usuario = await this.getUserFromtoken(access_token)

    const meta = usuario.metas.find(meta => meta.id === id)

    if (!meta) {
      console.log('Meta não encontrada');
      throw new NotFoundException('Meta não encontrada'); // 404
    }

    return this.entityManager.remove(meta)
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
      console.log('Usuário não encontrado');
      throw new NotFoundException('Usuário não encontrado'); // 404
    }

    return usuario
  }
}
