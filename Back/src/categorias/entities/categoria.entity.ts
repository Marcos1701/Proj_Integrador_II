import { InjectEntityManager } from '@nestjs/typeorm';
import { Transacao } from 'src/transacoes/entities/transacao.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Column, Entity, EntityManager, ManyToOne, OneToMany, PrimaryGeneratedColumn, RemoveEvent, UpdateEvent } from 'typeorm';

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn(
    'uuid', // tipo de dado do id
    {
      name: 'id_categoria', // nome da coluna no banco de dados
      comment: 'Identificador da tabela categoria' // comentário da coluna no banco de dados
    }
  )
  id: string;

  @Column({
    length: 100
  })
  nome: string;

  @Column({
    length: 250,
    nullable: true
  })
  descricao?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataCriacao: Date;

  @Column(
    {
      type: 'decimal',
      precision: 10, // 10 digitos
      nullable: true
    }
  )
  orcamento?: number;

  @Column({
    type: 'float',
    default: 0,
    nullable: false
  })
  gasto: number;

  @Column({
    length: 15,
    nullable: true
  })
  icone?: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.categorias, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  usuario: Usuario;

  @OneToMany(() => Transacao, (transacao) => transacao.categoria)
  transacoes: Transacao[];

  @InjectEntityManager()
  private readonly entityManager: EntityManager

  constructor(categoria: Partial<Categoria>) {
    Object.assign(this, categoria)
  }

  updateData(categoria: Partial<Categoria>) {
    Object.assign(this, categoria);
  }

  atualizaGasto() {
    const transacoes = this.transacoes.map(transacao => {
      const { categoria, ...retorno } = transacao;

      retorno.valor = Number(retorno.valor);
      return {
        ...retorno,
        categoriaid: categoria.id
      }
    });


    this.gasto = transacoes.reduce((acc, curr) => {
      if (curr.tipo === 'entrada') {
        return acc + curr.valor;
      }
      return acc - curr.valor;
    }, 0);
  }

  async save() {
    return await this.entityManager.save<Categoria>(this);
  }

}
