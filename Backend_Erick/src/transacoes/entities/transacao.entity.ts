import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Transacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: number;

  @Column()
  valor: number;

  @Column()
  titulo: string;

  @Column()
  descricao: string;

  @OneToOne(() => Usuario)
  @JoinColumn()
  usuario: Usuario;

  @OneToOne(() => Categoria)
  @JoinColumn()
  categoria: Categoria;

  constructor(transacao: Partial<Transacao>) {
    Object.assign(this, transacao);
  }
}
