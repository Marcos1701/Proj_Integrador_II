import { EntityManager, EntitySubscriberInterface, EventSubscriber, InsertEvent, LoadEvent, RemoveEvent, UpdateEvent } from "typeorm";
import { Categoria } from "../entities/categoria.entity";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Transacao } from "src/transacoes/entities/transacao.entity";

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

    private async getCategoria(categoria: Categoria, user?: boolean) {
        if (categoria.transacoes) return categoria;
        try {
            const categoria_ = await this.mananger.findOne(Categoria, {
                where: { id: categoria.id },
                select: {
                    id: true,
                    nome: true,
                    gasto: true,
                    orcamento: true,
                    usuario: user ? {
                        id: true,
                        saldo: true
                    } : {}
                },
                loadEagerRelations: false // para resolver o erro acima
            });

            if (categoria_) {
                categoria_.transacoes = await this.mananger.find(Transacao, {
                    where: { categoria: { id: categoria_.id } },
                });
            }
            return categoria_;
        } catch (error) {
            console.log('Erro ao buscar a categoria:', error);
        }
        return null;
    }


    private async AtualizaSaldo(categoria: Categoria) {
        const categoria_ = await this.getCategoria(categoria);

        if (!categoria_) {
            return;
        }

        categoria_.gasto = categoria_.transacoes.reduce((acc, curr) => {
            curr.data = new Date(curr.data);
            if (curr.data.getMonth() === new Date().getMonth() && curr.data.getFullYear() === new Date().getFullYear()) {
                return acc + Number(curr.valor);
            }
            return acc;
        }, 0);

        try {
            await this.mananger.update(Categoria, categoria_.id, { gasto: categoria_.gasto });
        } catch (error) {
            console.error('Erro ao atualizar a categoria:', error);
        }
        return categoria_;
    }

    afterLoad(entity: Categoria, event?: LoadEvent<Categoria>): void | Promise<any> {
        this.categoria = entity;
        this.AtualizaSaldo(this.categoria);
        return;
    }

    async afterUpdate(event: UpdateEvent<Categoria>) {

        const gasto = event.entity.gasto ? Number(event.entity.gasto) : 0;
        if (event.entity.orcamento && gasto > Number(event.entity.orcamento)) {
            await event.queryRunner.rollbackTransaction();
            throw new BadRequestException('O valor do orçamento é menor que o gasto da categoria');
        }
        // tudo certo
        return event.entity;
    }

    async beforeRemove(event: RemoveEvent<Categoria>) {
        const categoria = await this.getCategoria(event.entity);

        if (!categoria) {
            return;
        }

        categoria.usuario.saldo += categoria.gasto;
        await this.mananger.update(Usuario, categoria.usuario.id, categoria.usuario);
        return categoria;
    }
}