import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SubMeta } from "../sub_meta/entities/sub_meta.entity";
import { MarcoMeta } from "../marco_meta/entities/marco_meta.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { FindAllMetaDto } from "../sub_meta/Queries_interfaces/find-all.interface";

@Entity()
export class Meta {

    @PrimaryGeneratedColumn(
        'uuid', // tipo de dado do id
    )
    id: string;

    @Column({
        length: 100
    })
    titulo: string;

    @Column({
        length: 250,
        nullable: true
    })
    descricao?: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
    }) // 10 digitos no total, sendo 2 depois da virgula
    valor: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2
    }) // 10 digitos no total, sendo 2 depois da virgula
    valorAtual: number = 0; // inicializa com 0

    // progresso %
    progresso: number = 0;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    dataLimite: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    dataCriacao: Date;

    @Column({
        type: 'text',
        default: "dollar-bill"
    })
    icone: string = "dollar-bill";

    @Column({
        type: 'boolean',
        default: false
    })
    concluida: boolean = false;


    @Column({
        type: 'boolean',
        default: true
    })
    ativo: boolean = true;

    @ManyToOne(() => Usuario, (usuario) => usuario.metas, {
        nullable: false
    })
    @JoinColumn()
    usuario: Usuario;


    @OneToMany(type => SubMeta, (subMeta) => subMeta.meta, {
        cascade: true,
        eager: true
    })
    subMetas: SubMeta[];

    @OneToMany(type => MarcoMeta, (marcoMeta) => marcoMeta.meta, {
        cascade: true,
        eager: true
    })
    marcos: MarcoMeta[];

    constructor(meta: Partial<Meta>) {
        Object.assign(this, meta);
    }

    getSubMetas(orders?: FindAllMetaDto) {
        const subMetas = this.subMetas;

        if (orders.orderby) {
            subMetas.sort((a, b) => {
                if (a[orders.orderby] < b[orders.orderby]) return -1;
                if (a[orders.orderby] > b[orders.orderby]) return 1;
                return 0;
            })
        }
        if (orders.direction && orders.direction === 'DESC') {
            subMetas.reverse();
        }
        if (orders.search) {
            return subMetas.filter(subMeta => subMeta.titulo.includes(orders.search));
        }
        return subMetas;
    }

    getMarcos() {
        return this.marcos;
    }

    atualizarProgresso() {
        this.progresso = this.valorAtual / this.valor * 100;
    }
}
