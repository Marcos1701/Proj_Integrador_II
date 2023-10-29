import { Injectable } from '@nestjs/common';
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
    ) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    const categoria = new Categoria(createCategoriaDto);
    await this.entityManager.save(categoria);
  }

  async findAll() {
    return this.categoriasRepository.find();
  }

  async findOne(id: number) {
    return this.categoriasRepository.findOneBy({ id });
  }

  update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return `This action updates a #${id} categoria`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoria`;
  }
}
