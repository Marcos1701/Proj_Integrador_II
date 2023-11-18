import { Transform } from "class-transformer";
import { Meta } from "src/meta/entities/meta.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class MarcoMeta {
    @PrimaryGeneratedColumn(
        'uuid', // tipo de dado do id
    )
    id: string;

    @Column({
        length: 100
    })
    titulo: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
    }) // 10 digitos no total, sendo 2 depois da virgula
    valor: number;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    data: Date;

    @ManyToOne(() => Meta, (meta) => meta.marcos, {
        nullable: false,
    })
    @JoinColumn()
    meta: Meta;

    constructor(marcoMeta: Partial<MarcoMeta>) {
        Object.assign(this, marcoMeta);
    }
}
