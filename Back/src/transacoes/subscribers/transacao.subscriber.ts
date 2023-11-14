import { EntityManager, EntitySubscriberInterface, EventSubscriber, InsertEvent, LoadEvent, RemoveEvent, UpdateEvent } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Transacao } from "../entities/transacao.entity";
import { Categoria } from "src/categorias/entities/categoria.entity";


@EventSubscriber()
@Injectable()
export class TransacaoSubscriber implements EntitySubscriberInterface<Transacao>{
    private transacao: Transacao;
    constructor(
        private mananger: EntityManager
    ) { mananger.connection.subscribers.push(this) }

    listenTo() {
        return Transacao;
    }

    afterLoad(entity: Transacao, event?: LoadEvent<Transacao>): void | Promise<any> {
        this.transacao = entity;
    }

    async beforeInsert(event: InsertEvent<Transacao>) {

        const categoria = await this.mananger.findOne(Categoria, { where: { id: event.entity.categoria.id } });
        if (!categoria) {
            throw new BadRequestException('Categoria não encontrada');
        }

        if (
            categoria.orcamento && categoria.orcamento < event.entity.valor
            && event.entity.tipo === 'saida'
        ) {
            throw new BadRequestException('O valor da transação excede o orçamento da categoria');
        }

        if (event.entity.tipo === 'saida') {
            categoria.gasto += event.entity.valor;
        } else {
            categoria.gasto -= event.entity.valor;
        }

        categoria.usuario.atualizarSaldo();
        await this.mananger.save(categoria.usuario);
        await this.mananger.save(categoria);
    }

    async beforeUpdate(event: UpdateEvent<Transacao>) {

        if (!event.entity.valor || !event.entity.tipo) {
            return;
        }

        const categoria = await this.mananger.findOne(Categoria, {
            where: {
                id: this.transacao.categoria.id
            }
        });

        if (!categoria) {
            throw new BadRequestException('Categoria não encontrada');
        }

        if (!event.entity.categoria) {
            if (event.entity.tipo == this.transacao.tipo) {
                if (event.entity.tipo === 'saida') {
                    categoria.gasto -= this.transacao.valor;
                    categoria.gasto += event.entity.valor;
                } else {
                    categoria.gasto += this.transacao.valor;
                    categoria.gasto -= event.entity.valor;
                }
            } else {
                if (event.entity.tipo === 'saida') {
                    categoria.gasto += this.transacao.valor + event.entity.valor;
                } else {
                    categoria.gasto -= this.transacao.valor + event.entity.valor;
                }
            }
        } else {
            const Novacategoria = await this.mananger.findOne(Categoria, { where: { id: event.entity.categoria.id } });

            if (!Novacategoria) {
                throw new BadRequestException('Categoria não encontrada');
            }

            if (event.entity.tipo == this.transacao.tipo) {
                if (event.entity.tipo === 'saida') {
                    categoria.gasto -= this.transacao.valor;
                    Novacategoria.gasto += event.entity.valor;
                } else {
                    categoria.gasto += this.transacao.valor;
                    Novacategoria.gasto -= event.entity.valor;
                }
            } else {
                if (event.entity.tipo === 'saida') {
                    categoria.gasto += this.transacao.valor;
                    Novacategoria.gasto += event.entity.valor;
                } else {
                    categoria.gasto -= this.transacao.valor;
                    Novacategoria.gasto -= event.entity.valor;
                }
            }

            if (categoria.orcamento && categoria.gasto > categoria.orcamento) {
                throw new BadRequestException('O valor da transação excede o orçamento da categoria');
            }

            if (Novacategoria.orcamento && Novacategoria.gasto > Novacategoria.orcamento) {
                throw new BadRequestException('O valor da transação excede o orçamento da categoria');
            }
            await this.mananger.save(Novacategoria);
        }

        categoria.usuario.atualizarSaldo();
        await this.mananger.save(categoria.usuario);
        await this.mananger.save(categoria);
    }

    async afterRemove(event: RemoveEvent<Transacao>) {
        if (!this.transacao.usuario || !this.transacao.categoria) {
            return;
        }
        this.transacao.categoria.atualizaGasto();
        this.transacao.usuario.atualizarSaldo();
    }

}