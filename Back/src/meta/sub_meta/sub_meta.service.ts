import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubMetaDto } from './dto/create-sub_meta.dto';
import { UpdateSubMetaDto } from './dto/update-sub_meta.dto';
import { EntityManager } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { jwtDecodeUser } from 'src/auth/jwt.strategy';
import { SubMeta } from './entities/sub_meta.entity';
import { FindAllMetaDto } from './Queries_interfaces/find-all.interface';

@Injectable()
export class SubMetaService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly jwtService: JwtService,
  ) { }
  async create(access_token: string, id_meta: string, createSubMetaDto: CreateSubMetaDto) {
    const usuario = await this.getUserFromtoken(access_token)
    const meta = usuario.metas.find(meta => meta.id === id_meta)

    if (!meta) {
      console.log('Meta não encontrada');
      throw new NotFoundException('Meta não encontrada'); // 404
    }

    const subMeta = this.entityManager.create(
      'SubMeta',
      {
        ...createSubMetaDto,
        meta
      }
    )

    await this.entityManager.save(subMeta)

    return subMeta
  }

  async findAll(access_token: string, id_meta: string, query?: FindAllMetaDto) {
    const usuario = await this.getUserFromtoken(access_token)
    const meta = usuario.metas.find(meta => meta.id === id_meta)

    if (!meta) {
      console.log('Meta não encontrada');
      throw new NotFoundException('Meta não encontrada'); // 404
    }

    return meta.getSubMetas(query)
  }

  async findOne(access_token: string, id_meta: string, id: string) {
    const usuario = await this.getUserFromtoken(access_token)
    const meta = usuario.metas.find(meta => meta.id === id_meta)

    if (!meta) {
      console.log('Meta não encontrada');
      throw new NotFoundException('Meta não encontrada'); // 404
    }

    const subMeta = meta.subMetas.find(subMeta => subMeta.id === id)

    if (!subMeta) {
      console.log('SubMeta não encontrada');
      throw new NotFoundException('SubMeta não encontrada'); // 404
    }

    return subMeta
  }

  async update(access_token: string, id_meta: string, id: string, updateSubMetaDto: UpdateSubMetaDto) {
    const usuario = await this.getUserFromtoken(access_token)
    const meta = usuario.metas.find(meta => meta.id === id_meta)

    if (!meta) {
      console.log('Meta não encontrada');
      throw new NotFoundException('Meta não encontrada'); // 404
    }

    const subMeta = meta.subMetas.find(subMeta => subMeta.id === id)

    if (!subMeta) {
      console.log('SubMeta não encontrada');
      throw new NotFoundException('SubMeta não encontrada'); // 404
    }

    if (Object.keys(updateSubMetaDto).filter(key => updateSubMetaDto[key] == subMeta[key]).length === Object.keys(updateSubMetaDto).length) {
      throw new NotFoundException('Nenhuma alteração foi feita'); // 400
    }

    const updatedSubMeta = this.entityManager.merge<SubMeta>(
      SubMeta,
      subMeta,
      updateSubMetaDto
    )

    await this.entityManager.save(updatedSubMeta)

    return updatedSubMeta
  }

  async remove(access_token: string, id_meta: string, id: string) {
    const usuario = await this.getUserFromtoken(access_token)
    const meta = usuario.metas.find(meta => meta.id === id_meta)

    if (!meta) {
      console.log('Meta não encontrada');
      throw new NotFoundException('Meta não encontrada'); // 404
    }

    const subMeta = meta.subMetas.find(subMeta => subMeta.id === id)

    if (!subMeta) {
      console.log('SubMeta não encontrada');
      throw new NotFoundException('SubMeta não encontrada'); // 404
    }

    await this.entityManager.remove(subMeta)

    return subMeta
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
