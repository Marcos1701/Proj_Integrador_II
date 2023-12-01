import { EntityManager, EntitySubscriberInterface, EventSubscriber, InsertEvent, LoadEvent, RemoveEvent, UpdateEvent } from "typeorm";
import { Categoria } from "../entities/categoria.entity";
import { BadRequestException, Injectable } from "@nestjs/common";


@EventSubscriber()
@Injectable()
export class CategoriasSubscriber implements EntitySubscriberInterface<Categoria>{
    private categoria: Categoria
    constructor(
        private mananger: EntityManager
    ) { mananger.connection.subscribers.push(this) }

    listenTo() {
        return Categoria;
    }

    private async AtualizaSaldo(categoria: Categoria) {
        const categoria_ = await this.mananger.findOne(Categoria, {
            where: { id: categoria.id },
            relations: { transacoes: true }
        });

        if (!categoria_) {
            return;
        }

        categoria_.gasto = categoria_.transacoes.reduce((acc, curr) => { return acc + curr.valor }, 0);
        await this.mananger.save(categoria_);
    }


    afterLoad(entity: Categoria, event?: LoadEvent<Categoria>): void | Promise<any> {
        this.categoria = entity;
        this.AtualizaSaldo(this.categoria);
    }


    async beforeInsert(event: InsertEvent<Categoria>) {
        console.log(`Adicionando categoria ${event.entity.nome} ao usuário ${event.entity.usuario.nome}`)
    }

    async afterUpdate(event: UpdateEvent<Categoria>) {

        const gasto = event.entity.gasto ? Number(event.entity.gasto) : 0;
        if (event.entity.orcamento && gasto > Number(event.entity.orcamento)) {
            await event.queryRunner.rollbackTransaction();
            console.log(event.entity.orcamento, this.categoria.gasto)
            console.log(event.entity)
            console.log(this.categoria)
            throw new BadRequestException('O valor do orçamento é menor que o gasto da categoria');
        }
        // tudo certo
        return event.entity;
    }

    async beforeRemove(event: RemoveEvent<Categoria>) {

        const categoria = await this.mananger.findOne(Categoria, {
            where: { id: event.entity.id },
            relations: { usuario: true, transacoes: true }
        });

        if (!categoria) {
            return;
        }

        categoria.usuario.saldo += categoria.gasto;
        await this.mananger.save(categoria.usuario);
    }


}