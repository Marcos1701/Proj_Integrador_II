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
// nest g service categorias
// para criar tudo  de uma vez

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

    await this.entityManager.save(usuario);

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
      },
      relations: {
        usuario: true
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
    const usuario = await this.getUserFromtoken(access_token);
    const categorias = usuario.getCategorias('DESC', CategoriasorderBy.gasto);
    const categoriasComTransacoes = categorias.map(categoria => {
      const transacoes = usuario.getTransacoes("DESC", null, null, categoria.id);
      return {
        ...categoria,
        transacoes
      }
    })

    const data = new Date();
    const dados = categoriasComTransacoes.filter(categoria => {
      return categoria.transacoes.some(transacao => {
        const dataTransacao = new Date(transacao.data);
        return dataTransacao.getMonth() === data.getMonth() && dataTransacao.getFullYear() === data.getFullYear();
      })
    }).map(categoria => {
      return {
        id: categoria.id,
        nome: categoria.nome,
        gasto: categoria.gasto,
        qtdTransacoes: categoria.transacoes.length
      }
    });

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
      relations: {
        transacoes: true
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
    const usuario = await this.getUserFromtoken(access_token);
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
      [categoria: string]: {
        [ano: number]: {
          [mes: number]: {
            transacoes: TransacaoData[],
            nome: string,
            id: string
          }
        }
      }
    }
      = categoriasComTransacoes.reduce((acc, categoria) => {
        const transacoes = categoria.transacoes.reduce((acc, transacao) => {
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

        return {
          ...acc,
          [categoria.nome]: {
            ...transacoes,
            nome: categoria.nome,
            id: categoria.id
          }
        } // {nomeCategoria: {ano: {mes: [transacoes]}}}
      }
        , {});

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
      relations: {
        transacoes: true
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


  private getUserFromtoken(token: string): Promise<Usuario> {
    const data = this.jwtService.decode(token) as jwtDecodeUser

    const usuario = this.entityManager.findOne(
      Usuario,
      {
        where: {
          id: data.id
        },
        relations: {
          categorias: true,
          transacoes: true
        }
      })

    if (!usuario) {
      console.log('Usuário não encontrado');
      throw new NotFoundException('Usuário não encontrado'); // 404
    }

    return usuario
  }

}
