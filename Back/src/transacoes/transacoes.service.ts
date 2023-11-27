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


    if (!categoria && createTransacoeDto.tipo === 'saida') {
      throw new NotFoundException('Categoria não encontrada');
    }

    if (categoria && categoria.orcamento &&
      createTransacoeDto.tipo === 'saida' &&
      categoria.gasto + createTransacoeDto.valor > categoria.orcamento
    ) {
      throw new BadRequestException('O valor da transação excede o orçamento da categoria');
    }

    const data = categoria ? { ...createTransacoeDto, categoria } : createTransacoeDto;

    const result = await this.entityManager.insert<Transacao>(Transacao, {
      ...data,
      usuario
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

  async findDados(usuariotoken: string, ano?: number, mes?: number) {
    const usuario = await this.getUserFromtoken(usuariotoken, ['transacoes']);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (ano && ano > new Date().getFullYear()) {
      throw new BadRequestException('Ano inválido');
    }

    if (mes && (mes > 11 || mes < 0)) {
      throw new BadRequestException('Mês inválido');
    }

    const transacoes = usuario.transacoes.map(t => {
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
    })

    const totalGasto = transacoes.filter(t => t.tipo === 'saida').reduce((acc, cur) => acc + cur.valor, 0);
    const totalEntrada = transacoes.filter(t => t.tipo === 'entrada').reduce((acc, cur) => acc + cur.valor, 0);

    const dados = transacoes.map(t => {
      return {
        id: t.id,
        titulo: t.titulo,
        valor: t.valor,
        data: t.data,
        tipo: t.tipo
      }
    })

    return {
      dados,
      totalGasto,
      totalEntrada
    }
  }

  async findHistory(usuariotoken: string) {
    const usuario = await this.getUserFromtoken(usuariotoken, ['transacoes']);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const transacoes = usuario.transacoes.map(t => {
      return {
        id: t.id,
        titulo: t.titulo,
        valor: Number(t.valor),
        data: new Date(t.data),
        tipo: t.tipo
      }
    })

    // agrupa as transações pelo ano e mês
    const history = transacoes.reduce((acc, cur) => {
      const ano = cur.data.getFullYear();
      const mes = cur.data.getMonth();
      if (!acc[ano]) {
        acc[ano] = {};
      }
      if (!acc[ano][mes]) {
        acc[ano][mes] = [];
      }
      acc[ano][mes].push(cur);
      return acc;
    }, {}); // {ano: {mes: [transacoes]}}

    return history;
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
