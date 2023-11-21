import { ApiProperty } from "@nestjs/swagger";
import { Meta } from "src/meta/entities/meta.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ulid } from "ulidx";

@Entity()
export class SubMeta {

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
        type: 'boolean',
        default: false
    })
    concluida: boolean;

    @ManyToOne(() => Meta, (meta) => meta.marcos, {
        nullable: false,
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    meta: Meta;

    constructor(subMeta: Partial<SubMeta>) {
        Object.assign(this, subMeta);
    }
}
