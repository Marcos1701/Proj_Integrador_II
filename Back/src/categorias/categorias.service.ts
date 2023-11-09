import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

    if (!createCategoriaDto.nome) {
      throw new BadRequestException('Nome da categoria não informado'); // 400
    }

    if (createCategoriaDto.nome.length > 100) {
      throw new BadRequestException('Nome da categoria muito longo'); // 400
    }

    if (createCategoriaDto.descricao && createCategoriaDto.descricao.length > 250) {
      throw new BadRequestException('Descrição da categoria muito longa'); // 400
    }

    const categoria = new Categoria({ ...createCategoriaDto, usuario });
    await this.entityManager.save(categoria);
    return categoria;
  }

  async findOne(id: string, usertoken: string) {
    if (!id || id === '') {
      throw new BadRequestException('id da categoria não informado'); // 404
    }
    const usuario = await this.getUserFromtoken(usertoken);

    return await this.categoriasRepository.findOneBy({
      id, usuario: {
        id: usuario.id
      }
    });
  }

  async findAll(usertoken: string, orderby?: CategoriasorderBy, order?: 'ASC' | 'DESC', search?: string) {
    const usuario: Usuario = await this.getUserFromtoken(usertoken);
    const categorias = usuario.getCategorias(order, orderby, search);
    return categorias;
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto, access_token: string) {
    if (!id || id === '') {
      throw new NotFoundException('id da categoria não informado'); // 404
    }

    if ((!updateCategoriaDto.nome && !updateCategoriaDto.descricao && !updateCategoriaDto.orcamento)
      || (updateCategoriaDto.nome === '' || updateCategoriaDto.descricao === '' || updateCategoriaDto.orcamento === 0)) {
      throw new BadRequestException('Nenhum dado para atualizar'); // 400
    }

    if (updateCategoriaDto.nome && updateCategoriaDto.nome.length > 100) {
      throw new BadRequestException('Nome da categoria muito longo'); // 400
    }

    if (updateCategoriaDto.descricao && updateCategoriaDto.descricao.length > 250) {
      throw new BadRequestException('Descrição da categoria muito longa'); // 400
    }

    const usuario = await this.getUserFromtoken(access_token);

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
    if (!id || id === '') {
      throw new BadRequestException('id da categoria não informado'); // 404
    }
    await this.categoriasRepository.delete(id);
  }

  private getUserFromtoken(token: string): Promise<Usuario> {
    const data = this.jwtService.decode(token) as jwtDecodeUser

    const usuario = this.entityManager.findOneBy(
      Usuario,
      {
        id: data.id
      })

    if (!usuario) {
      console.log('Usuário não encontrado');
      throw new NotFoundException('Usuário não encontrado'); // 404
    }

    return usuario
  }

}
