import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Transacao {
  @PrimaryGeneratedColumn(
    'uuid', // tipo de dado do id
  )
  id: string;

  @Column({
    type: 'enum',
    enum: ['entrada', 'saida'],
  })
  tipo: 'entrada' | 'saida';

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  }) // 10 digitos no total, sendo 2 depois da virgula
  valor: number;

  @Column({
    length: 100
  })
  titulo: string;

  @Column({
    length: 250,
    nullable: true
  })
  descricao?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.transacoes, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn() // serve para indicar qual coluna vai ser a chave estrangeira
  usuario: Usuario; // usuario é o nome da coluna na tabela transacao

  @ManyToOne(() => Categoria, (categoria) => categoria.transacoes, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  categoria: Categoria;

  constructor(transacao: Partial<Transacao>) {
    Object.assign(this, transacao);
  }

  updateData(transacao: Partial<Transacao>) {
    Object.assign(this, transacao);
  }


}
