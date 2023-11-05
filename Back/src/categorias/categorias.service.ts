import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { EntityManager } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriasRepository: Repository<Categoria>,
    private readonly entityManager: EntityManager,
  ) { }

  async create(createCategoriaDto: CreateCategoriaDto) {
    const categoria = new Categoria(createCategoriaDto);
    await this.entityManager.save(categoria);
  }

  async findOne(id: string, usertoken: string) {
    return await this.categoriasRepository.findOneBy({
      id, usuario: {
        JWT: usertoken
      }
    });
  }

  async findAll(usertoken: string) {
    return await this.categoriasRepository.find(
      {
        where: {
          usuario: {
            JWT: usertoken
          }
        }
      }
    )
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    const result = await this.categoriasRepository.update(
      { id, usuario: { JWT: updateCategoriaDto.usertoken } },
      updateCategoriaDto
    );

    if (result.affected === 0) {
      throw new NotFoundException('Categoria não encontrada');
    }
    return result
  }

  async remove(id: string) {
    await this.categoriasRepository.delete(id);
  }
}
