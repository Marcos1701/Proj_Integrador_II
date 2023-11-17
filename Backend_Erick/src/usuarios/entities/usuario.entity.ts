import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  saldo: number;

  constructor(usuario: Partial<Usuario>) {
    Object.assign(this, usuario);
  }
}
