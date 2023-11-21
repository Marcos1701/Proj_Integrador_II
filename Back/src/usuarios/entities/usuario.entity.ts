import { ApiProperty } from '@nestjs/swagger';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Transform } from 'class-transformer';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Meta } from 'src/meta/entities/meta.entity';
import { Transacao } from 'src/transacoes/entities/transacao.entity';
import { Column, Entity, EntityManager, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum CategoriasorderBy {
  nome = "nome",
  datacriacao = "datacriacao",
  orcamento = "orcamento",
  gasto = "gasto"
}

export enum TransacoesorderBy {
  titulo = "titulo",
  valor = "valor",
  entrada = 'entrada',
  saida = 'saida',
  data = "data"
}

export interface ordenarTransacoes {
  titulo?: 'ASC' | 'DESC';
  valor?: 'ASC' | 'DESC';
  data?: 'ASC' | 'DESC';
  tipo?: 'entrada' | 'saida';
  categoriaid?: string;
}

export interface returnTransacao {
  id: string;
  tipo: 'entrada' | 'saida';
  valor: number;
  titulo: string;
  descricao?: string;
  data: Date;
  categoriaid: string;
}

export enum Metasorderby {
  titulo = "titulo",
  valor = "valor",
  dataLimite = "dataLimite",
  dataCriacao = "dataCriacao",
  progresso = "progresso"
}

@Entity()
export class Usuario {

  @PrimaryGeneratedColumn(
    'uuid', // tipo de dado do id
    { name: 'id' }, // nome da coluna no banco de dados
  )
  id: string;


  @Column(
    {
      length: 100,
    }
  )
  nome: string;

  @Column(
    {
      type: 'float',
      default: 0,
      nullable: false
    }
  )
  @Transform(value => Number(value))
  saldo: number;


  @Column(
    {
      unique: true,
    }
  )
  email: string; // para adicionar um verificador de email, basta adicionar o @IsEmail() do class-validator

  @Column(
    {
      length: 100
    }
  )
  senha: string;

  @OneToMany(type => Categoria, categoria => categoria.usuario)
  categorias: Categoria[];

  @OneToMany(type => Transacao, transacao => transacao.usuario)
  transacoes: Transacao[];

  @OneToMany(type => Meta, meta => meta.usuario)
  metas: Meta[];

  @InjectEntityManager()
  private readonly entityManager: EntityManager

  constructor(usuario: Partial<Usuario>) {
    Object.assign(this, usuario);
  }

  getTransacoes(order: 'ASC' | 'DESC' = 'ASC', orderby?: TransacoesorderBy, search?: string, categoriaid?: string): returnTransacao[] {
    if (!this.transacoes) { return [] }

    let TransacoesOrdenadas: returnTransacao[] = this.transacoes.map(transacao => {
      const { categoria, ...retorno } = transacao;

      return {
        ...retorno,
        categoriaid: categoria.id
      }
    })//.sort((a, b) => order != 'DESC' ? a.dataCriacao.getTime() - b.dataCriacao.getTime() : b.dataCriacao.getTime() - a.dataCriacao.getTime())

    if (orderby) {
      if (orderby == TransacoesorderBy.titulo) { TransacoesOrdenadas = TransacoesOrdenadas.sort((a, b) => order !== 'DESC' ? a.titulo.localeCompare(b.titulo) : b.titulo.localeCompare(a.titulo)) }
      if (orderby == TransacoesorderBy.valor) { TransacoesOrdenadas = TransacoesOrdenadas.sort((a, b) => order !== 'DESC' ? a.valor - b.valor : b.valor - a.valor) }
      if (orderby == TransacoesorderBy.entrada || orderby == TransacoesorderBy.saida) { TransacoesOrdenadas = TransacoesOrdenadas.filter(transacao => transacao.tipo === orderby) }
    }

    if (categoriaid) { TransacoesOrdenadas = TransacoesOrdenadas.filter(transacao => transacao.categoriaid === categoriaid) }

    if (search) {
      TransacoesOrdenadas = TransacoesOrdenadas.filter(transacao => transacao.titulo.toLowerCase().includes(search.toLowerCase()))
    }

    return TransacoesOrdenadas;
  }

  getTransacao(id: string): Transacao | undefined {
    return this.transacoes.find(transacao => transacao.id === id);
  }

  getCategorias(order: 'ASC' | 'DESC' = 'ASC', orderby?: CategoriasorderBy, search?: string): Categoria[] {

    if (!this.categorias) { return [] }

    let CategoriasOrdenadas: Categoria[] = this.categorias.sort((a, b) => order != 'DESC' ? a.dataCriacao.getTime() - b.dataCriacao.getTime() : b.dataCriacao.getTime() - a.dataCriacao.getTime())

    if (orderby) {
      if (orderby == CategoriasorderBy.nome) { CategoriasOrdenadas = CategoriasOrdenadas.sort((a, b) => order !== 'DESC' ? a.nome.localeCompare(b.nome) : b.nome.localeCompare(a.nome)) }
      if (orderby == CategoriasorderBy.datacriacao) { CategoriasOrdenadas = CategoriasOrdenadas.sort((a, b) => order !== 'DESC' ? a.dataCriacao.getTime() - b.dataCriacao.getTime() : b.dataCriacao.getTime() - a.dataCriacao.getTime()) }
      if (orderby == CategoriasorderBy.orcamento) { CategoriasOrdenadas = CategoriasOrdenadas.sort((a, b) => order !== 'DESC' ? a.orcamento - b.orcamento : b.orcamento - a.orcamento) }
      if (orderby == CategoriasorderBy.gasto) { CategoriasOrdenadas = CategoriasOrdenadas.sort((a, b) => order !== 'DESC' ? a.gasto - b.gasto : b.gasto - a.gasto) }
    }

    if (search) {
      CategoriasOrdenadas = CategoriasOrdenadas.filter(categoria => categoria.nome.toLowerCase().includes(search.toLowerCase()))
    }

    return CategoriasOrdenadas;
  }

  getCategoria(id: string): Categoria | undefined {
    return this.categorias.find(categoria => categoria.id === id);
  }

  getMeta(id: string): Meta | undefined {
    return this.metas.find(meta => meta.id === id);
  }

  getMetas(order: 'ASC' | 'DESC' = 'ASC', orderby?: Metasorderby, search?: string): Meta[] {
    const metas = this.metas;
    if (!metas) { return [] }

    metas.sort((a, b) => order != 'DESC' ? a.dataCriacao.getTime() - b.dataCriacao.getTime() : b.dataCriacao.getTime() - a.dataCriacao.getTime())

    metas.map(meta => {
      meta.atualizarProgresso();
      return meta;
    }) // atualiza o progresso de cada meta

    if (orderby) {
      metas.sort((a, b) => {
        if (a[orderby] < b[orderby]) return -1;
        if (a[orderby] > b[orderby]) return 1;
        return 0;
      })
    }

    if (search) {
      return metas.filter(meta => meta.titulo.toLowerCase().includes(search.toLowerCase()))
    }

    return metas;
  }

  updateData(usuario: Partial<Usuario>) {
    Object.assign(this, usuario);
  }


  atualizarSaldo() {
    const transacoes = this.transacoes.map(transacao => {
      const { categoria, ...retorno } = transacao;

      retorno.valor = Number(retorno.valor);
      return {
        ...retorno,
        categoriaid: categoria.id
      }
    })

    this.saldo = transacoes.reduce((acc, curr) => {
      if (curr.tipo === 'entrada') {
        return acc + curr.valor;
      }
      return acc - curr.valor;
    }, 0);
  }

  async save() {
    return await this.entityManager.save<Usuario>(this);
  }

}
