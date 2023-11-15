import { EntityManager, EntitySubscriberInterface, EventSubscriber, InsertEvent, LoadEvent, RemoveEvent, UpdateEvent } from "typeorm";
import { Categoria } from "../entities/categoria.entity";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Usuario } from "src/usuarios/entities/usuario.entity";


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

    afterLoad(entity: Categoria, event?: LoadEvent<Categoria>): void | Promise<any> {
        this.categoria = entity;
    }


    async beforeInsert(event: InsertEvent<Categoria>) {
        console.log(`Adicionando categoria ${event.entity.nome} ao usuário ${event.entity.usuario.nome}`)
    }

    async afterUpdate(event: UpdateEvent<Categoria>) {

        if (!event.entity.orcamento) {
            return;
        }

        if (this.categoria.gasto > event.entity.orcamento) {
            console.log(`O valor do orçamento é menor que o gasto da categoria ${this.categoria.nome} do usuário ${this.categoria.usuario.nome}`)
            event.queryRunner.rollbackTransaction();
            throw new BadRequestException('O valor do orçamento é menor que o gasto da categoria');
        }
        console.log(`Atualizando categoria ${this.categoria.nome} do usuário ${this.categoria.usuario.nome}`)
        // tudo certo
        return;
    }

    async beforeRemove(event: RemoveEvent<Categoria>) {
        console.log(`Removendo categoria ${event.entity.nome} do usuário ${event.entity.usuario.nome}`)
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