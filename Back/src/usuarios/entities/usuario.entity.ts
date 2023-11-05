import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Transacao } from 'src/transacoes/entities/transacao.entity';
import { Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

interface ordenarCategorias {
  nome: 'ASC' | 'DESC';
  dataCriacao: 'ASC' | 'DESC';
  orcamento: 'ASC' | 'DESC';
}

interface ordenarTransacoes {
  titulo: 'ASC' | 'DESC';
  valor: 'ASC' | 'DESC';
  dataCriacao: 'ASC' | 'DESC';
  tipo: 'entrada' | 'saida';
  categoriaid: string;
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

  @Column()
  JWT: string; // para gerar um JWT, basta adicionar o @IsJWT() do class-validator, da seguinte forma: @IsJWT()

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

  getTransacoes(order?: ordenarTransacoes): Transacao[] {
    let TransacoesOrdenadas: Transacao[] = this.transacoes;
    if (order) {
      if (order.titulo) TransacoesOrdenadas = TransacoesOrdenadas.sort((a, b) => order.titulo === 'ASC' ? a.titulo.localeCompare(b.titulo) : b.titulo.localeCompare(a.titulo))
      if (order.valor) TransacoesOrdenadas = TransacoesOrdenadas.sort((a, b) => order.valor === 'ASC' ? a.valor - b.valor : b.valor - a.valor)
      if (order.dataCriacao) TransacoesOrdenadas = TransacoesOrdenadas.sort((a, b) => order.dataCriacao === 'ASC' ? a.dataCriacao.getTime() - b.dataCriacao.getTime() : b.dataCriacao.getTime() - a.dataCriacao.getTime())
      if (order.tipo) TransacoesOrdenadas = TransacoesOrdenadas.sort((a, b) => order.tipo === 'entrada' ? 1 : -1)
      if (order.categoriaid) TransacoesOrdenadas = TransacoesOrdenadas.filter(transacao => transacao.categoria.id === order.categoriaid)

    }
    return TransacoesOrdenadas;
  }

  getTransacao(id: string): Transacao | undefined {
    return this.transacoes.find(transacao => transacao.id === id);
  }

  getCategorias(order?: ordenarCategorias): Categoria[] {
    let CategoriasOrdenadas: Categoria[] = this.categorias;
    if (order) {
      if (order.nome) CategoriasOrdenadas = CategoriasOrdenadas.sort((a, b) => order.nome === 'ASC' ? a.nome.localeCompare(b.nome) : b.nome.localeCompare(a.nome))
      if (order.dataCriacao) CategoriasOrdenadas = CategoriasOrdenadas.sort((a, b) => order.dataCriacao === 'ASC' ? a.dataCriacao.getTime() - b.dataCriacao.getTime() : b.dataCriacao.getTime() - a.dataCriacao.getTime())
      if (order.orcamento) CategoriasOrdenadas = CategoriasOrdenadas.sort((a, b) => order.orcamento === 'ASC' ? a.orcamento - b.orcamento : b.orcamento - a.orcamento)
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
