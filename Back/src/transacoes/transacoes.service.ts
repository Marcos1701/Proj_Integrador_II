import { BadRequestException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
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


  async create(createTransacoeDto: CreateTransacoeDto, access_token: string) {

    const usuario = await this.getUserFromtoken(access_token);
    const categoria = await this.entityManager.findOne(
      Categoria,
      {
        where: {
          id: createTransacoeDto.categoriaid,
          usuario: {
            id: usuario.id
          },
        },
        relations: {
          usuario: true,
          transacoes: true
        }
      });

    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }

    if (createTransacoeDto.tipo === 'saida' && categoria.gasto + createTransacoeDto.valor > categoria.orcamento) {
      throw new BadRequestException('O valor da transação excede o orçamento da categoria');
    }

    const transacao = new Transacao({ ...createTransacoeDto, usuario, categoria: categoria });

    const result = await this.entityManager.save<Transacao>(transacao);

    if (!result) {
      throw new NotFoundException('Transação não encontrada');
    }
    if (result.tipo === 'entrada') {
      categoria.gasto = categoria.gasto - result.valor <= 0 ? 0 : categoria.gasto - result.valor;
    } else {
      categoria.gasto += result.valor;
    }
    usuario.saldo += result.tipo === 'entrada' ? result.valor : -result.valor;

    this.entityManager.save(categoria);
    this.entityManager.save(usuario);

    return result;
  }


  async findOne(id: string, usuariotoken: string) {
    if (!id || id === '') {
      throw new BadRequestException('id da transação não informado'); // 404
    }
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
    const usuario = await this.getUserFromtoken(usuariotoken, ['transacoes']);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const transacoes = usuario.getTransacoes(
      order ? order : null,
      orderby ? orderby : null,
      search ? search : null,
      categoriaid ? categoriaid : null
    )
    return transacoes;
  }



  async update(id: string, updateTransacoeDto: UpdateTransacoeDto, access_token: string) {
    if (!id || id === '') {
      throw new BadRequestException('id da transação não informado'); // 404
    }

    if ((!updateTransacoeDto.titulo && !updateTransacoeDto.descricao && !updateTransacoeDto.valor && !updateTransacoeDto.categoriaid)
      || (updateTransacoeDto.titulo === '' && updateTransacoeDto.descricao === '' && updateTransacoeDto.valor === 0 && updateTransacoeDto.categoriaid === '')) {
      throw new BadRequestException('Nenhum dado para atualizar'); // 400
    }

    const usuario = await this.getUserFromtoken(access_token);

    const transacao: Transacao = await this.entityManager.findOne(
      Transacao, {
      where: {
        id,
        usuario: {
          id: usuario.id
        },
      },
      relations: {
        categoria: true
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
        await this.entityManager.update(
          Transacao, {
          id,
          usuario: {
            id: usuario.id
          }
        },
          { ...transacao }
        );
        throw new NotFoundException('Categoria não encontrada');
      }

      if (updateTransacoeDto.tipo === 'saida' && categoriaNova.gasto + updateTransacoeDto.valor > categoriaNova.orcamento) {
        await this.entityManager.update(
          Transacao, {
          id,
          usuario: {
            id: usuario.id
          }
        },
          { ...transacao }
        );
        throw new BadRequestException('O valor da transação excede o orçamento da categoria');
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

      usuario.saldo = transacao.tipo === 'entrada' ? usuario.saldo - transacao.valor : usuario.saldo + transacao.valor;

      await this.entityManager.save(categoriaAntiga);
      await this.entityManager.save(categoriaNova);

    }
    usuario.saldo = updateTransacoeDto.tipo === 'entrada' ? usuario.saldo + updateTransacoeDto.valor : usuario.saldo - updateTransacoeDto.valor;
    await this.entityManager.save(usuario);

    return result;
  }


  async remove(id: string, usuariotoken: string) {
    if (!id || id === '') {
      throw new BadRequestException('id da transação não informado'); // 404
    }

    const usuario = await this.getUserFromtoken(usuariotoken);

    const transacao: Transacao = await this.entityManager.findOne(
      Transacao, {
      where: {
        id,
        usuario: {
          id: usuario.id
        },
      },
    }
    );
    const result: DeleteResult = await this.entityManager.delete<Transacao>(
      Transacao, {
      id,
      usuario: {
        id: usuario.id
      }
    });

    if (result.affected === 0) {
      throw new NotFoundException('Transação não encontrada');
    }
    usuario.saldo = transacao.tipo === 'entrada' ? usuario.saldo - transacao.valor : usuario.saldo + transacao.valor;
    await this.entityManager.save(usuario);
    return result;
  }

  private async getUserFromtoken(token: string, relations?: string[]): Promise<Usuario> {
    const data = this.jwtService.decode(token) as jwtDecodeUser

    const usuario = await this.entityManager.findOne(
      Usuario,
      {
        where: {
          id: data.id
        },
        relations: {
          categorias: relations && relations.includes('categorias') ? true : false,
          transacoes: relations && relations.includes('transacoes') ? true : false
        }
      }
    )

    if (!usuario) {
      console.log('Usuário não encontrado');
      throw new NotFoundException('Usuário não encontrado'); // 404
    }

    return usuario
  }
}
