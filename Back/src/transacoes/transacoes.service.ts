import { BadRequestException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateTransacoeDto } from './dto/create-transacoe.dto';
import { UpdateTransacoeDto } from './dto/update-transacoe.dto';
import { EntityManager, UpdateResult } from 'typeorm';
import { Transacao } from './entities/transacao.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { JwtService } from '@nestjs/jwt';
import { jwtDecodeUser } from 'src/auth/jwt.strategy';

interface UpdateData {
  titulo?: string;
  descricao?: string;
  data?: Date;
  valor?: number;
  categoria?: Categoria;
}

export interface TransacaoData {
  id: string
  titulo: string
  valor: number
  data: Date
  tipo: string
}

export interface TransacoesDadosResponse {
  dados: TransacaoData[]
  totalGasto: number
  totalEntrada: number
}

export enum SortField {
  ID = 'id',
  TIPO = 'tipo',
  VALOR = 'valor',
  TITULO = 'titulo',
  DESCRICAO = 'descricao',
  DATA = 'data',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

@Injectable()
export class TransacoesService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly jwtService: JwtService,
  ) { }

  // Função para validar o id da transação
  private validateTransactionId(id: string) {
    if (!id || id === '') {
      throw new BadRequestException('id da transação não informado');
    }
  }

  // Função para mapear e filtrar as transações
  private mapAndFilterTransactions(transacoes: Transacao[], ano?: number, mes?: number) {
    return transacoes.map(t => {
      return {
        id: t.id,
        titulo: t.titulo,
        valor: Number(t.valor),
        data: new Date(t.data),
        tipo: t.tipo,
        categoriaid: t.categoria ? t.categoria.id : null,
      }
    }).filter(t => {
      if (ano && mes) {
        return t.data.getFullYear() === ano && t.data.getMonth() === mes;
      } else if (ano) {

        return t.data.getFullYear() === ano;
      } else if (mes) {

        return t.data.getMonth() === mes;
      }
      return true;
    });
  }

  // Agora você pode reutilizar essas funções nas suas funções existentes
  async findOne(id: string, usuariotoken: string) {
    this.validateTransactionId(id);
    const usuario = await this.getUserFromtoken(usuariotoken);

    const transacao = await this.entityManager.findOne(Transacao, {
      where: {
        id,
        usuario: {
          id: usuario.id
        }
      },
      select: {
        id: true,
        titulo: true,
        descricao: true,
        valor: true,
        data: true,
        tipo: true,
        categoria: {
          id: true,
          nome: true,
          orcamento: true,
          gasto: true
        }
      }
    });

    if (!transacao) {
      throw new NotFoundException('Transação não encontrada');
    }

    return transacao;
  }

  async create(createTransacoeDto: CreateTransacoeDto, usuariotoken: string) {
    const usuario = await this.getUserFromtoken(usuariotoken, true, false);

    const categoria = createTransacoeDto.categoriaid ?
      await this.entityManager.findOne(Categoria, {
        where: {
          id: createTransacoeDto.categoriaid,
          usuario: {
            id: usuario.id
          }
        }
      }) : null;

    if (!categoria && createTransacoeDto.tipo === 'saida') {
      // console.log('Categoria não encontrada');
      throw new NotFoundException('Categoria não encontrada');
    }

    const transacao = await this.entityManager.insert(Transacao, {
      ...createTransacoeDto,
      categoria: categoria,
      usuario: usuario
    });

    if (transacao.identifiers.length === 0) {
      throw new BadRequestException(transacao.raw.message ? transacao.raw.message : 'Erro ao criar transação');
    }

    return transacao;
  }

  async findDados(usuariotoken: string, ano?: number, mes?: number) {
    const usuario = await this.getUserFromtoken(usuariotoken, false, true);

    if (ano && ano > new Date().getFullYear()) {
      throw new BadRequestException('Ano inválido');
    }

    if (mes && (mes > 11 || mes < 0)) {
      throw new BadRequestException('Mês inválido');
    }

    const dados = this.mapAndFilterTransactions(usuario.transacoes, ano == undefined ? ano : null, mes == undefined ? mes : null);

    return {
      totalGasto: dados.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0),
      totalEntrada: dados.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0)
    }
  }

  async findHistory(usuariotoken: string, ano?: number, mes?: number) {
    const usuario = await this.getUserFromtoken(usuariotoken, false, true);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (ano !== undefined && ano > new Date().getFullYear()) {
      throw new BadRequestException('Ano inválido');
    }

    if (mes !== undefined && (mes > 12 || mes <= 0)) {
      throw new BadRequestException('Mês inválido');
    }

    const transacoes = this.mapAndFilterTransactions(usuario.transacoes, ano == undefined ? ano : null, mes == undefined ? mes : null);

    const anos = ano == undefined ? [...new Set(transacoes.map(t => t.data.getFullYear()))] : [ano];

    // agrupa as transações pelo ano e mês
    const history: {
      ano: number,
      meses: {
        mes: number,
        transacoes: TransacaoData[]
      }[]
    }[] = [];

    anos.forEach(anoTransacao => {
      for (let m = 0; m < 12; m++) {
        const transacoesDoMes = transacoes.filter(t => {
          return t.data.getFullYear() === anoTransacao && t.data.getMonth() === m;
        });
        if (!history.find(h => h.ano === anoTransacao)) {
          history.push({
            ano: anoTransacao,
            meses: []
          });
        }

        history.find(h => h.ano === anoTransacao).meses.push({
          mes: m,
          transacoes: transacoesDoMes
        });
      }
    });


    return {
      history
    }
  }

  async findAll(usuariotoken: string, page: number = 1, limit: number = 10, sortField: SortField = SortField.DATA, sortOrder: SortOrder = SortOrder.DESC) {
    // Validação dos parâmetros de paginação
    if (page < 1) throw new BadRequestException('Número da página deve ser maior ou igual a 1');
    if (limit < 1) throw new BadRequestException('Limite deve ser maior ou igual a 1');

    // Validação dos parâmetros de ordenação
    if (!Object.values(SortField).includes(sortField)) {
      throw new BadRequestException('Campo de ordenação inválido');
    }
    if (!Object.values(SortOrder).includes(sortOrder)) {
      throw new BadRequestException('Direção de ordenação inválida');
    }

    const usuario = await this.getUserFromtoken(usuariotoken, false, true);

    // Busca das transações com paginação e ordenação
    const transacoes = await this.entityManager.find(Transacao, {
      where: { usuario: { id: usuario.id } },
      take: limit,
      skip: (page - 1) * limit,
      select: {
        id: true,
        titulo: true,
        descricao: true,
        valor: true,
        data: true,
        tipo: true,
        categoria: {
          id: true,
          nome: true,
          orcamento: true,
          gasto: true
        }
      },
      relations: {
        categoria: true
      },
      order: {
        [sortField]: sortOrder,
      },
    });

    // Mapeamento e filtragem das transações
    const mappedTransacoes = this.mapAndFilterTransactions(transacoes);

    return mappedTransacoes;
  }


  async update(id: string, updateTransacoeDto: UpdateTransacoeDto, access_token: string) {
    if (!id || id === '') {
      throw new BadRequestException('id da transação não informado'); // 404
    }

    if (updateTransacoeDto.valor && isNaN(updateTransacoeDto.valor)) {
      throw new BadRequestException('Valor inválido'); // 400
    }

    const usuario = await this.getUserFromtoken(access_token, false, true)

    const transacao: Transacao = await this.entityManager.findOne(
      Transacao, {
      where: {
        id,
        usuario: {
          id: usuario.id
        },
      },
      select: {
        id: true,
        titulo: true,
        descricao: true,
        valor: true,
        data: true,
        tipo: true,
        categoria: {
          id: true,
          nome: true,
          orcamento: true,
          gasto: true
        }
      },
      relations: {
        categoria: true
      }
    });

    if (Object.keys(updateTransacoeDto).filter(key => updateTransacoeDto[key] == transacao[key]).length === Object.keys(updateTransacoeDto).length) {
      throw new BadRequestException('Nenhum dado para atualizar'); // 400
    }

    const data: UpdateData = {};

    if (updateTransacoeDto.titulo) data.titulo = updateTransacoeDto.titulo;
    if (updateTransacoeDto.descricao) data.descricao = updateTransacoeDto.descricao;
    if (updateTransacoeDto.valor) data.valor = updateTransacoeDto.valor;
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
      if (!categoria && transacao.tipo === 'saida') {
        throw new NotFoundException('Categoria não encontrada');
      }
      categoria && (data.categoria = categoria);
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


      categoriaAntiga.gasto -= transacao.valor;
      usuario.saldo += transacao.valor;

      categoriaNova.gasto += updateTransacoeDto.valor;
      usuario.saldo -= updateTransacoeDto.valor;


      await this.entityManager.update(Categoria, { id: categoriaAntiga.id }, { ...categoriaAntiga });
      await this.entityManager.update(Categoria, { id: categoriaNova.id }, { ...categoriaNova });

    } else if (updateTransacoeDto.valor && updateTransacoeDto.valor !== transacao.valor) {
      usuario.saldo = updateTransacoeDto.tipo === 'entrada' ? usuario.saldo + updateTransacoeDto.valor : usuario.saldo - updateTransacoeDto.valor;
    }

    await this.entityManager.update(Usuario, { id: usuario.id }, { ...usuario });

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
      select: {
        id: true,
        titulo: true,
        descricao: true,
        valor: true,
        data: true,
        tipo: true,
        categoria: {
          id: true,
          nome: true,
          orcamento: true,
          gasto: true
        },
        usuario: {
          id: true,
          saldo: true
        }
      }
    });

    const result: Transacao = await this.entityManager.remove<Transacao>(
      transacao
    );

    if (!result) {
      throw new NotFoundException('Transação não encontrada');
    }

    return result;
  }

  private async getUserFromtoken(token: string, categorias?: boolean, transacoes?: boolean): Promise<Usuario> {
    const data = this.jwtService.decode(token) as jwtDecodeUser

    const relations = [
      categorias ? 'categorias' : '',
      transacoes ? 'transacoes' : '',
      transacoes ? 'transacoes.categoria' : ''
    ].filter(rel => rel !== '')

    const usuario = await this.entityManager.findOne(
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
              gasto: true
            }
          } : false
        },
        relations: relations
      });

    if (!usuario) {
      // console.log('Usuário não encontrado');
      throw new NotFoundException('Usuário não encontrado'); // 404
    }

    return usuario
  }
}
