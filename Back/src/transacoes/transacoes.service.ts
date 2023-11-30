import { BadRequestException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateTransacoeDto } from './dto/create-transacoe.dto';
import { UpdateTransacoeDto } from './dto/update-transacoe.dto';
import { EntityManager, UpdateResult } from 'typeorm';
import { Transacao } from './entities/transacao.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { TransacoesorderBy, Usuario, ordenarTransacoes } from 'src/usuarios/entities/usuario.entity';
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

  // Função para buscar um usuário a partir de um token
  private async getUserFromToken(token: string, relations?: string[]): Promise<Usuario> {
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
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario
  }

  // Função para mapear e filtrar as transações
  private mapAndFilterTransactions(transacoes: Transacao[], ano?: number, mes?: number) {
    return transacoes.map(t => {
      return {
        id: t.id,
        titulo: t.titulo,
        valor: Number(t.valor),
        data: new Date(t.data),
        tipo: t.tipo
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
    const usuario = await this.getUserFromToken(usuariotoken);

    const transacao = await this.entityManager.findOne(Transacao, {
      where: {
        id,
        usuario: {
          id: usuario.id
        }
      },
      relations: {
        categoria: true
      }
    });

    if (!transacao) {
      console.log('Transação não encontrada');
      throw new NotFoundException('Transação não encontrada');
    }

    return transacao;
  }

  async create(createTransacoeDto: CreateTransacoeDto, usuariotoken: string) {
    const usuario = await this.getUserFromToken(usuariotoken, ['categorias']);

    const categoria = createTransacoeDto.categoriaid &&
      await this.entityManager.findOne(Categoria, {
        where: {
          id: createTransacoeDto.categoriaid,
          usuario: {
            id: usuario.id
          }
        }
      });

    if (!categoria && createTransacoeDto.tipo === 'saida') {
      console.log('Categoria não encontrada');
      throw new NotFoundException('Categoria não encontrada');
    }

    const transacao = this.entityManager.create(Transacao, {
      ...createTransacoeDto,
      categoria: categoria,
      usuario: usuario
    });

    await this.entityManager.save(transacao);

    return transacao;
  }

  async findDados(usuariotoken: string, ano?: number, mes?: number) {
    const usuario = await this.getUserFromtoken(usuariotoken, ['transacoes']);

    if (ano && ano > new Date().getFullYear()) {
      throw new BadRequestException('Ano inválido');
    }

    if (mes && (mes > 11 || mes < 0)) {
      throw new BadRequestException('Mês inválido');
    }

    const dados = this.mapAndFilterTransactions(usuario.transacoes, ano, mes);
    const totalGasto = dados.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0);
    const totalEntrada = dados.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0);

    return {
      dados,
      totalGasto,
      totalEntrada
    }
  }

  async findHistory(usuariotoken: string, ano?: number, mes?: number) {
    const usuario = await this.getUserFromtoken(usuariotoken, ['transacoes']);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }


    if (ano && ano > new Date().getFullYear()) {
      throw new BadRequestException('Ano inválido');
    }

    if (mes && (mes > 12 || mes <= 0)) {
      throw new BadRequestException('Mês inválido');
    }

    const transacoes = this.mapAndFilterTransactions(usuario.transacoes, ano, mes);

    // agrupa as transações pelo ano e mês
    const history: {
      ano: number,
      meses: {
        mes: number,
        transacoes: TransacaoData[]
      }[]
    }[] = [];

    transacoes.forEach(t => {
      const ano = t.data.getFullYear();
      const mes = t.data.getMonth() + 1;

      const anoIndex = history.findIndex(h => h.ano === ano);
      if (anoIndex === -1) {
        history.push({
          ano,
          meses: [{
            mes,
            transacoes: [t]
          }]
        })
      } else {
        const mesIndex = history[anoIndex].meses.findIndex(m => m.mes === mes);
        if (mesIndex === -1) {
          history[anoIndex].meses.push({
            mes,
            transacoes: [t]
          })
        } else {
          history[anoIndex].meses[mesIndex].transacoes.push(t);
        }
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

    const usuario = await this.getUserFromToken(usuariotoken, ['transacoes']);

    // Cálculo do offset
    const offset = (page - 1) * limit;

    // Busca das transações com paginação e ordenação
    const transacoes = await this.entityManager.find(Transacao, {
      where: { usuario: { id: usuario.id } },
      take: limit,
      skip: offset,
      relations: ['categoria'],
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


      await this.entityManager.save(categoriaAntiga);
      await this.entityManager.save(categoriaNova);

    } else if (updateTransacoeDto.valor && updateTransacoeDto.valor !== transacao.valor) {
      usuario.saldo = updateTransacoeDto.tipo === 'entrada' ? usuario.saldo + updateTransacoeDto.valor : usuario.saldo - updateTransacoeDto.valor;
    }

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
