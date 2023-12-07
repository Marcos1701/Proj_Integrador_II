import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { EntityManager } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Usuario, CategoriasorderBy, TransacoesorderBy } from 'src/usuarios/entities/usuario.entity';
import { JwtService } from '@nestjs/jwt';
import { jwtDecodeUser } from 'src/auth/jwt.strategy';
import { TransacaoData } from 'src/transacoes/transacoes.service';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriasRepository: Repository<Categoria>,
    private readonly entityManager: EntityManager,
    private readonly jwtService: JwtService,

  ) { }

  private async validateCategoriaDto(createCategoriaDto: CreateCategoriaDto) {
    if (!createCategoriaDto.nome) {
      throw new BadRequestException('Nome da categoria não informado'); // 400
    }

    if (createCategoriaDto.nome.length > 100) {
      throw new BadRequestException('Nome da categoria muito longo'); // 400
    }

    if (createCategoriaDto.descricao && createCategoriaDto.descricao.length > 250) {
      throw new BadRequestException('Descrição da categoria muito longa'); // 400
    }
  }

  private async validateCategoriaDtoUpdate(updateCategoriaDto: UpdateCategoriaDto) {
    if (!updateCategoriaDto.nome && !updateCategoriaDto.descricao && !updateCategoriaDto.orcamento) {
      throw new BadRequestException('Nenhum dado para atualizar'); // 400
    }

    if (updateCategoriaDto.nome && updateCategoriaDto.nome.length > 100) {
      throw new BadRequestException('Nome da categoria muito longo'); // 400
    }

    if (updateCategoriaDto.descricao && updateCategoriaDto.descricao.length > 250) {
      throw new BadRequestException('Descrição da categoria muito longa'); // 400
    }
  }

  private async validateId(id: string) {
    if (!id || id === '') {
      throw new BadRequestException('id da categoria não informado'); // 404
    }
  }


  async create(createCategoriaDto: CreateCategoriaDto, token: string) {
    await this.validateCategoriaDto(createCategoriaDto);
    const usuario = await this.getUserFromtoken(token);

    const categoria = await this.entityManager.insert(
      Categoria,
      {
        ...createCategoriaDto,
        usuario
      }
    )

    if (categoria.identifiers.length === 0) {
      throw new BadRequestException(categoria.raw.message ? categoria.raw.message : 'Erro ao criar categoria');
    }

    return categoria;
  }

  async findOne(id: string, usertoken: string) {
    await this.validateId(id);
    const usuario = await this.getUserFromtoken(usertoken);

    return await this.categoriasRepository.findOneBy({
      id, usuario: {
        id: usuario.id
      }
    });
  }

  async findAll(usertoken: string, orderby?: CategoriasorderBy, order?: 'ASC' | 'DESC', search?: string) {
    const usuario: Usuario = await this.getUserFromtoken(usertoken, true, false);
    const categorias = usuario.getCategorias(order, orderby, search);

    return categorias;
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto, access_token: string) {
    await this.validateId(id);
    await this.validateCategoriaDtoUpdate(updateCategoriaDto);

    const usuario = await this.getUserFromtoken(access_token);

    const categoria = await this.entityManager.findOne(
      Categoria, {
      where: {
        id,
        usuario: {
          id: usuario.id
        }
      },
      relations: {
        usuario: true
      }
    });

    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }

    if (updateCategoriaDto.orcamento && updateCategoriaDto.orcamento < categoria.gasto) {
      throw new BadRequestException('O orçamento não pode ser menor que o gasto');
    }

    const result = await this.entityManager.update(
      Categoria, { id }, { ...updateCategoriaDto }
    );

    if (result.affected === 0) {
      throw new NotFoundException('Categoria não encontrada');
    }
    usuario.atualizarSaldo();

    await this.entityManager.update(Usuario, { id: usuario.id }, { saldo: usuario.saldo })

    return result
  }

  async remove(id: string, access_token: string) {
    if (!id || id === '') {
      throw new BadRequestException('id da categoria não informado'); // 404
    }
    const usuarioPertencente = await this.getUserFromtoken(access_token);

    const categoria = await this.entityManager.findOne(
      Categoria, {
      where: {
        id,
        usuario: {
          id: usuarioPertencente.id
        }
      }, select: {
        id: true
      }
    });

    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const result = await this.entityManager.remove(
      Categoria, categoria, {
      data: {
        usuario: {
          id: usuarioPertencente.id
        }
      }
    }
    ); // deleta a categoria e todas as transacoes relacionadas a ela

    const { usuario, ...retorno } = result;
    return retorno
  }

  async dados(access_token: string) {
    const usuario = await this.getUserFromtoken(access_token, true, true);
    const categoriasComTransacoes = usuario.getCategorias('DESC', CategoriasorderBy.gasto).map(categoria => {
      const transacoes = usuario.getTransacoes("DESC", null, null, categoria.id);
      return {
        ...categoria,
        transacoes
      }
    })

    const data = new Date();
    const dados = categoriasComTransacoes.map(categoria => {
      categoria.transacoes = categoria.transacoes.filter(transacao => {
        const dataTransacao = new Date(transacao.data);
        return dataTransacao.getMonth() === data.getMonth() && dataTransacao.getFullYear() === data.getFullYear();
      })
      return {
        id: categoria.id,
        nome: categoria.nome,
        gasto: categoria.gasto,
        qtdTransacoes: categoria.transacoes.length
      }
    })

    const totalGasto = categoriasComTransacoes.reduce((acc, categoria) => {
      return categoria.gasto ? acc + categoria.gasto : acc
    }, 0)

    return {
      dados,
      totalGasto
    }
  }

  async dadosCategoria(id: string, access_token: string) {
    const usuario = await this.getUserFromtoken(access_token);
    const categoria = await this.entityManager.findOne(
      Categoria, {
      where: {
        id,
        usuario: {
          id: usuario.id
        }
      },
      select: {
        id: true,
        nome: true,
        gasto: true,
        transacoes: {
          id: true,
          titulo: true,
          valor: true,
          data: true,
          tipo: true
        }
      }
    });

    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const data = new Date();
    const transacoes = categoria.transacoes.filter(transacao => {
      const dataTransacao = new Date(transacao.data);
      return dataTransacao.getMonth() === data.getMonth() && dataTransacao.getFullYear() === data.getFullYear();
    })

    const totalGasto = transacoes.reduce((acc, transacao) => {
      return transacao.valor ? acc + transacao.valor : acc
    }, 0)

    return {
      id: categoria.id,
      nome: categoria.nome,
      gasto: categoria.gasto,
      qtdTransacoes: transacoes.length,
      totalGasto
    }
  }

  async historicoCategorias(access_token: string) {
    const usuario = await this.getUserFromtoken(access_token, true, true);
    const categorias = usuario.getCategorias('DESC', CategoriasorderBy.gasto);

    const categoriasComTransacoes = categorias.map(categoria => {
      const transacoes = usuario.getTransacoes("DESC", null, null, categoria.id);
      return {
        ...categoria,
        transacoes
      }
    })

    // agrupa, em cada categoria, as transacoes por ano e mes
    const history: {
      categorias:
      {
        id: string,
        nome: string,
        history: {
          anos: {
            ano: number,
            meses: {
              mes: number,
              transacoes: TransacaoData[]
            }[]
          }[]
        }
      }[]
    }
      = {
      categorias: categoriasComTransacoes.map(categoria => {

        const history = categoria.transacoes.reduce((acc, transacao) => {
          const dataTransacao = new Date(transacao.data);
          const ano = dataTransacao.getFullYear();
          const mes = dataTransacao.getMonth();

          if (!acc[ano]) {
            acc[ano] = {}
          }

          if (!acc[ano][mes]) {
            acc[ano][mes] = []
          }

          acc[ano][mes].push(transacao);

          return acc
        }
          , {});

        const anos = Object.keys(history).map(ano => {
          return {
            ano: Number(ano),
            meses: Object.keys(history[ano]).map(mes => {
              return {
                mes: Number(mes),
                transacoes: history[ano][mes]
              }
            })
          }
        })

        return {
          id: categoria.id,
          nome: categoria.nome,
          history: {
            anos
          }
        }
      })
    }

    return { history }
  }

  async historicoCategoria(id: string, access_token: string) {
    const usuario = await this.getUserFromtoken(access_token);
    const categoria = await this.entityManager.findOne(
      Categoria, {
      where: {
        id,
        usuario: {
          id: usuario.id
        }
      },
      select: {
        id: true,
        nome: true,
        transacoes: {
          id: true,
          titulo: true,
          valor: true,
          data: true,
          tipo: true
        }
      }
    });

    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const history = categoria.transacoes.reduce((acc, transacao) => {
      const dataTransacao = new Date(transacao.data);
      const ano = dataTransacao.getFullYear();
      const mes = dataTransacao.getMonth();

      if (!acc[ano]) {
        acc[ano] = {}
      }

      if (!acc[ano][mes]) {
        acc[ano][mes] = []
      }

      acc[ano][mes].push(transacao);

      return acc
    }
      , {});

    return { history }
  }


  private getUserFromtoken(token: string, categorias?: boolean, transacoes?: boolean): Promise<Usuario> {
    const data = this.jwtService.decode(token) as jwtDecodeUser

    const relations = [
      categorias ? 'categorias' : '',
      transacoes ? 'transacoes' : '',
      transacoes ? 'transacoes.categoria' : ''
    ].filter(rel => rel !== '')

    const usuario = this.entityManager.findOne(
      Usuario,
      {
        where: {
          id: data.id
        },
        select: {
          id: true,
          saldo: true,
          categorias: categorias ? {
            id: true,
            nome: true,
            orcamento: true,
            gasto: true,
            dataCriacao: true
          } : false,
          transacoes: transacoes ? {
            id: true,
            titulo: true,
            valor: true,
            data: true,
            tipo: true,
            categoria: {
              id: true,
              nome: true,
              orcamento: true,
              gasto: true,
              dataCriacao: true
            }
          } : false
        },
        relations: relations
      })

    if (!usuario) {
      // console.log('Usuário não encontrado');
      throw new NotFoundException('Usuário não encontrado'); // 404
    }

    return usuario
  }

}
