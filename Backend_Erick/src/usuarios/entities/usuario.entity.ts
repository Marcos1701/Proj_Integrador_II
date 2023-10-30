import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// (username, password, active, profile)
@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  saldo: number;

}
