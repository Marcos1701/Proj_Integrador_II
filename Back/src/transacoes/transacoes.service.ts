import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateTransacoeDto } from './dto/create-transacoe.dto';
import { UpdateTransacoeDto } from './dto/update-transacoe.dto';
import { DeleteResult, EntityManager, UpdateResult } from 'typeorm';
import { Transacao } from './entities/transacao.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { TransacoesorderBy, Usuario, ordenarTransacoes } from 'src/usuarios/entities/usuario.entity';
import { JwtService } from '@nestjs/jwt';
import { jwtDecodeUser } from 'src/auth/jwt.strategy';

@Injectable()
export class TransacoesService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly jwtService: JwtService,
  ) { }


  async create(createTransacoeDto: CreateTransacoeDto) {

    const usuario = await this.getUserFromtoken(createTransacoeDto.usuariotoken);
    const categoria = await this.entityManager.findOne(
      Categoria,
      {
        where: {
          id: createTransacoeDto.categoriaid,
          usuario: {
            id: usuario.id
          }
        }
      });

    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const result = await this.entityManager.save(
      Transacao, {
      ...createTransacoeDto,
      categoria: categoria,
      usuario: categoria.usuario
    });

    if (!result) {
      throw new NotFoundException('Transação não encontrada');
    }
    if (result.tipo === 'entrada') {
      categoria.gasto -= result.valor;
    } else {
      categoria.gasto += result.valor;
    }

    return result;
  }


  async findOne(id: string, usuariotoken: string) {
    const usuario = await this.getUserFromtoken(usuariotoken);
    return this.entityManager.findOne(
      Transacao, {
      where: {
        id,
        usuario: {
          id: usuario.id
        }
      }
    });
  }

  async findAll(usuariotoken: string, orderby?: TransacoesorderBy, order?: 'ASC' | 'DESC', search?: string, categoriaid?: string) {
    const usuario = await this.getUserFromtoken(usuariotoken);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const transacoes = usuario.getTransacoes(
      order ? order : null,
      orderby ? orderby : null,
      search ? search : null,
      categoriaid ? categoriaid : null
    )
    return { transacoes };
  }



  async update(id: string, updateTransacoeDto: UpdateTransacoeDto) {
    const usuario = await this.getUserFromtoken(updateTransacoeDto.usuariotoken);

    const transacao: Transacao = await this.entityManager.findOne(
      Transacao, {
      where: {
        id,
        usuario: {
          id: usuario.id
        }
      }
    });

    const result: UpdateResult = await this.entityManager.update(
      Transacao, {
      id,
      usuario: {
        id: usuario.id
      }
    },
      { ...updateTransacoeDto }
    );

    if (result.affected === 0) {
      throw new NotFoundException('Transação não encontrada');
    }

    if (updateTransacoeDto.categoriaid && updateTransacoeDto.categoriaid !== transacao.categoria.id) {
      const categoriaAntiga = transacao.categoria;
      const categoriaNova = await this.entityManager.findOne(
        Categoria,
        {
          where: {
            id: updateTransacoeDto.categoriaid,
            usuario: {
              id: usuario.id
            }
          }
        });
      if (!categoriaNova) {
        await this.entityManager.save(transacao);
        throw new NotFoundException('Categoria não encontrada');
      }

      if (transacao.tipo === 'entrada') {
        categoriaAntiga.gasto -= transacao.valor;
      } else {
        categoriaAntiga.gasto += transacao.valor;
      }

      if (updateTransacoeDto.tipo === 'entrada') {
        categoriaNova.gasto += updateTransacoeDto.valor;
      } else {
        categoriaNova.gasto -= updateTransacoeDto.valor;
      }

      this.entityManager.save(categoriaAntiga);
      this.entityManager.save(categoriaNova);
    }

    return result;
  }


  async remove(id: string, usuariotoken: string) {
    const usuario = await this.getUserFromtoken(usuariotoken);
    const result: DeleteResult = await this.entityManager.delete(
      Transacao, {
      id,
      usuario: {
        id: usuario.id
      }
    });

    if (result.affected === 0) {
      throw new NotFoundException('Transação não encontrada');
    }
    return result;
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
