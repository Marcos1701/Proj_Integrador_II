import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMarcoMetaDto } from './dto/create-marco_meta.dto';
import { UpdateMarcoMetaDto } from './dto/update-marco_meta.dto';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { jwtDecodeUser } from 'src/auth/jwt.strategy';

@Injectable()
export class MarcoMetaService {

  constructor(
    private readonly entityManager: EntityManager,
    private readonly jwtService: JwtService,
  ) { }

  async create(access_token: string, id_meta: string, createMarcoMetaDto: CreateMarcoMetaDto) {
    const usuario: Usuario = await this.getUserFromtoken(access_token)
    const meta = usuario.metas.find(meta => meta.id === id_meta)

    if (!meta) {
      console.log('Meta não encontrada');
      throw new NotFoundException('Meta não encontrada'); // 404
    }

    const marco = this.entityManager.create(
      'MarcoMeta',
      {
        ...createMarcoMetaDto,
        meta
      }
    )

    await this.entityManager.save(marco)

    return marco
  }

  async findAll(access_token: string, id_meta: string) {
    const usuario: Usuario = await this.getUserFromtoken(access_token)

    const meta = usuario.metas.find(meta => meta.id === id_meta)

    if (!meta) {
      console.log('Meta não encontrada');
      throw new NotFoundException('Meta não encontrada'); // 404
    }

    return meta.marcos
  }

  async findOne(access_token: string, id_meta: string, id: string) {
    const usuario: Usuario = await this.getUserFromtoken(access_token)

    const meta = usuario.metas.find(meta => meta.id === id_meta)

    if (!meta) {
      console.log('Meta não encontrada');
      throw new NotFoundException('Meta não encontrada'); // 404
    }

    const marco = meta.marcos.find(marco => marco.id === id)

    if (!marco) {
      console.log('Marco não encontrado');
      throw new NotFoundException('Marco não encontrado'); // 404
    }

    return marco
  }

  async update(access_token: string, id_meta: string, id: string, updateMarcoMetaDto: UpdateMarcoMetaDto) {
    const usuario: Usuario = await this.getUserFromtoken(access_token)

    const meta = usuario.metas.find(meta => meta.id === id_meta)

    if (!meta) {
      console.log('Meta não encontrada');
      throw new NotFoundException('Meta não encontrada'); // 404
    }

    const marco = meta.marcos.find(marco => marco.id === id)

    if (!marco) {
      console.log('Marco não encontrado');
      throw new NotFoundException('Marco não encontrado'); // 404
    }

    const updatedMarco = this.entityManager.merge(
      'MarcoMeta',
      marco,
      updateMarcoMetaDto
    )

    await this.entityManager.save(updatedMarco)

    return updatedMarco
  }

  async remove(access_token: string, id_meta: string, id: string) {
    const usuario: Usuario = await this.getUserFromtoken(access_token)

    const meta = usuario.metas.find(meta => meta.id === id_meta)

    if (!meta) {
      console.log('Meta não encontrada');
      throw new NotFoundException('Meta não encontrada'); // 404
    }

    const marco = meta.marcos.find(marco => marco.id === id)

    if (!marco) {
      console.log('Marco não encontrado');
      throw new NotFoundException('Marco não encontrado'); // 404
    }

    return this.entityManager.remove(marco)
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
