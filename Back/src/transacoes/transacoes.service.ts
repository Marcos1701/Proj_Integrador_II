import { BadRequestException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateTransacoeDto } from './dto/create-transacoe.dto';
import { UpdateTransacoeDto } from './dto/update-transacoe.dto';
import { DeleteResult, EntityManager, UpdateResult } from 'typeorm';
import { Transacao } from './entities/transacao.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { TransacoesorderBy, Usuario, ordenarTransacoes } from 'src/usuarios/entities/usuario.entity';
import { JwtService } from '@nestjs/jwt';
import { jwtDecodeUser } from 'src/auth/jwt.strategy';

interface UpdateData {
  titulo?: string;
  descricao?: string;
  tipo?: 'entrada' | 'saida';
  data?: Date;
  valor?: number;
  categoria?: Categoria;
}

@Injectable()
export class TransacoesService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly jwtService: JwtService,
  ) { }


  async create(createTransacoeDto: CreateTransacoeDto, access_token: string) {

    const usuario = await this.getUserFromtoken(access_token, ['transacoes']);
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

    if (categoria.orcamento &&
      createTransacoeDto.tipo === 'saida' &&
      categoria.gasto + createTransacoeDto.valor > categoria.orcamento
    ) {
      throw new BadRequestException('O valor da transação excede o orçamento da categoria');
    }

    const result = await this.entityManager.insert<Transacao>(Transacao, {
      ...createTransacoeDto,
      usuario,
      categoria
    });

    if (!result) {
      throw new NotFoundException('Transação não encontrada');
    }

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

    if (updateTransacoeDto.valor && isNaN(updateTransacoeDto.valor)) {
      throw new BadRequestException('Valor inválido'); // 400
    }

    const usuario = await this.getUserFromtoken(access_token, ['transacoes']);

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

    const data: UpdateData = {};

    if (updateTransacoeDto.titulo) data.titulo = updateTransacoeDto.titulo;
    if (updateTransacoeDto.descricao) data.descricao = updateTransacoeDto.descricao;
    if (updateTransacoeDto.valor) data.valor = updateTransacoeDto.valor;
    if (updateTransacoeDto.tipo) data.tipo = updateTransacoeDto.tipo;
    if (updateTransacoeDto.data) data.data = updateTransacoeDto.data;
    if (updateTransacoeDto.categoriaid) {
      const categoria = await this.entityManager.findOne(
        Categoria,
        {
          where: {
            id: updateTransacoeDto.categoriaid,
            usuario: {
              id: usuario.id
            }
          }
        });
      if (!categoria) {
        throw new NotFoundException('Categoria não encontrada');
      }
      data.categoria = categoria;
    }
    const result: UpdateResult = await this.entityManager.update(
      Transacao, {
      id,
      usuario: {
        id: usuario.id
      }
    },
      { ...data }
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

      if (
        categoriaNova.orcamento &&
        updateTransacoeDto.tipo === 'saida'
        && categoriaNova.gasto + updateTransacoeDto.valor > categoriaNova.orcamento
      ) {
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
      relations: {
        usuario: true,
        categoria: true
      }
    }
    );

    const result: Transacao = await this.entityManager.remove<Transacao>(
      transacao
    );

    if (!result) {
      throw new NotFoundException('Transação não encontrada');
    }

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
    );



    if (!usuario) {
      console.log('Usuário não encontrado');
      throw new NotFoundException('Usuário não encontrado'); // 404
    }

    return usuario
  }
}
