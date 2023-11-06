import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { EntityManager } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Usuario, CategoriasorderBy } from 'src/usuarios/entities/usuario.entity';
import { JwtService } from '@nestjs/jwt';
import { jwtDecodeUser } from 'src/auth/jwt.strategy';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriasRepository: Repository<Categoria>,
    private readonly entityManager: EntityManager,
    private readonly jwtService: JwtService,

  ) { }

  async create(createCategoriaDto: CreateCategoriaDto, token: string) {
    const usuario = await this.getUserFromtoken(token);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado'); // 404
    }

    const categoria = new Categoria({ ...createCategoriaDto, usuario });
    await this.entityManager.save(categoria);
    return categoria;
  }

  async findOne(id: string, usertoken: string) {
    const usuario = await this.getUserFromtoken(usertoken);
    return await this.categoriasRepository.findOneBy({
      id, usuario: {
        id: usuario.id
      }
    });
  }

  async findAll(usertoken: string, orderby?: CategoriasorderBy, order?: 'ASC' | 'DESC', search?: string) {
    const usuario: Usuario = await this.getUserFromtoken(usertoken);
    return usuario.getCategorias(order, orderby, search);
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    const usuario = await this.getUserFromtoken(updateCategoriaDto.usertoken);

    const result = await this.categoriasRepository.update(
      { id, usuario: { id: usuario.id } },
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
