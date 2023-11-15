import { InjectEntityManager } from '@nestjs/typeorm';
import { Transacao } from 'src/transacoes/entities/transacao.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { AfterRemove, AfterSoftRemove, BeforeUpdate, Column, Entity, EntityManager, ManyToOne, OneToMany, PrimaryGeneratedColumn, RemoveEvent, UpdateEvent } from 'typeorm';

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

  @ManyToOne(() => Usuario, (usuario) => usuario.categorias)
  usuario: Usuario;

  @OneToMany(() => Transacao, (transacao) => transacao.categoria, {
    cascade: true
  })
  transacoes: Transacao[];

  @InjectEntityManager()
  private entityMananger: EntityManager;

  constructor(categoria: Partial<Categoria>) {
    Object.assign(this, categoria);
  }

  updateData(categoria: Partial<Categoria>) {
    Object.assign(this, categoria);
  }

  atualizaGasto() {
    this.gasto = this.transacoes.reduce((acc, curr) => {
      if (curr.tipo === 'entrada') {
        return acc + curr.valor;
      }
      return acc - curr.valor;
    }, 0);
  }


  // @BeforeUpdate()
  // async validaOrcamento(
  //   event: UpdateEvent<Categoria>
  // ) {
  //   if (!event.updatedColumns.find(column => column.propertyName === 'orcamento')) {
  //     return;
  //   }

  //   if (event.entity.orcamento && event.entity.gasto > event.entity.orcamento) {
  //     throw new Error('O orçamento não pode ser menor que o gasto');
  //   }
  // }
}
