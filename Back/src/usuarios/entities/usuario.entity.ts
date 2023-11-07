import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Transacao } from 'src/transacoes/entities/transacao.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum CategoriasorderBy {
  nome = "nome",
  datacriacao = "datacriacao",
  orcamento = "orcamento"
}

export enum TransacoesorderBy {
  titulo = "titulo",
  valor = "valor",
  entrada = 'entrada',
  saida = 'saida'
}

export interface ordenarTransacoes {
  titulo?: 'ASC' | 'DESC';
  valor?: 'ASC' | 'DESC';
  dataCriacao?: 'ASC' | 'DESC';
  tipo?: 'entrada' | 'saida';
  categoriaid?: string;
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
    }
  )
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

  @OneToMany(() => Categoria, (categoria) => categoria.usuario)
  categorias: Categoria[];

  @OneToMany(() => Transacao, (transacao) => transacao.usuario)
  transacoes: Transacao[];

  constructor(usuario: Partial<Usuario>) {
    Object.assign(this, usuario);
  }

  getTransacoes(order: 'ASC' | 'DESC' = 'ASC', orderby?: TransacoesorderBy, search?: string, categoriaid?: string): Transacao[] {
    if (!this.transacoes) { return [] }
    let TransacoesOrdenadas: Transacao[] = this.transacoes.sort((a, b) => order !== 'DESC' ? a.dataCriacao.getTime() - b.dataCriacao.getTime() : b.dataCriacao.getTime() - a.dataCriacao.getTime());

    if (orderby) {
      if (orderby == TransacoesorderBy.titulo) { TransacoesOrdenadas = TransacoesOrdenadas.sort((a, b) => order !== 'DESC' ? a.titulo.localeCompare(b.titulo) : b.titulo.localeCompare(a.titulo)) }
      if (orderby == TransacoesorderBy.valor) { TransacoesOrdenadas = TransacoesOrdenadas.sort((a, b) => order !== 'DESC' ? a.valor - b.valor : b.valor - a.valor) }
      if (orderby == TransacoesorderBy.entrada || orderby == TransacoesorderBy.saida) { TransacoesOrdenadas = TransacoesOrdenadas.filter(transacao => transacao.tipo === orderby) }
      if (categoriaid) { TransacoesOrdenadas = TransacoesOrdenadas.filter(transacao => transacao.categoria.id === categoriaid) }
    }

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

    let CategoriasOrdenadas: Categoria[] = this.categorias.sort((a, b) => order !== 'DESC' ? a.dataCriacao.getTime() - b.dataCriacao.getTime() : b.dataCriacao.getTime() - a.dataCriacao.getTime())

    if (orderby) {
      if (orderby == CategoriasorderBy.nome) { CategoriasOrdenadas = CategoriasOrdenadas.sort((a, b) => order !== 'DESC' ? a.nome.localeCompare(b.nome) : b.nome.localeCompare(a.nome)) }
      if (orderby == CategoriasorderBy.datacriacao) { CategoriasOrdenadas = CategoriasOrdenadas.sort((a, b) => order !== 'DESC' ? a.dataCriacao.getTime() - b.dataCriacao.getTime() : b.dataCriacao.getTime() - a.dataCriacao.getTime()) }
      if (orderby == CategoriasorderBy.orcamento) { CategoriasOrdenadas = CategoriasOrdenadas.sort((a, b) => order !== 'DESC' ? a.orcamento - b.orcamento : b.orcamento - a.orcamento) }
    }

    if (search) {
      CategoriasOrdenadas = CategoriasOrdenadas.filter(categoria => categoria.nome.toLowerCase().includes(search.toLowerCase()))
    }

    return CategoriasOrdenadas;
  }

  getCategoria(id: string): Categoria | undefined {
    return this.categorias.find(categoria => categoria.id === id);
  }

  updateData(usuario: Partial<Usuario>) {
    Object.assign(this, usuario);
  }

}
