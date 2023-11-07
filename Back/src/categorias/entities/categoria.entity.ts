import { Transacao } from 'src/transacoes/entities/transacao.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn(
    'uuid', // tipo de dado do id
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
      precision: 10,
      scale: 2,
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
    eager: true // quando for buscar uma categoria, já traz as transações junto
  })
  transacoes: Transacao[];

  constructor(categoria: Partial<Categoria>) {
    Object.assign(this, categoria);
  }

  updateData(categoria: Partial<Categoria>) {
    Object.assign(this, categoria);
  }
}
