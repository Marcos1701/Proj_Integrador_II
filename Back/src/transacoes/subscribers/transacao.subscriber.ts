import { EntityManager, EntitySubscriberInterface, EventSubscriber, InsertEvent, LoadEvent, RemoveEvent, UpdateEvent } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Transacao } from "../entities/transacao.entity";
import { Categoria } from "src/categorias/entities/categoria.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";

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
        this.transacao.valor = Number(this.transacao.valor);
    }

    private async getUsuario(id: string) {
        return await this.mananger.findOne(Usuario, {
            where: { id: id },
            select: {
                id: true,
                saldo: true,
                transacoes: {
                    id: true,
                    tipo: true,
                    valor: true,
                    titulo: true,
                    data: true
                }
            }
        }).catch(err => {
            return undefined;
        });
    }

    private async getCategoria(id: string, usuario?: boolean, transacoes?: boolean) {
        return await this.mananger.findOne(Categoria, {
            where: { id: id },
            select: {
                id: true,
                nome: true,
                gasto: true,
                orcamento: true,
                usuario: usuario ? {
                    id: true,
                    saldo: true,
                    transacoes: transacoes ? {
                        id: true,
                        tipo: true,
                        valor: true,
                        titulo: true,
                        data: true
                    } : false
                } : {},
                transacoes: transacoes ? {
                    id: true,
                    tipo: true,
                    valor: true,
                    titulo: true,
                    data: true
                } : false
            }
        }).catch(err => {
            return undefined;
        });
    }

    async afterInsert(event: InsertEvent<Transacao>) {
        const usuario = await this.getUsuario(event.entity.usuario.id);

        if (!usuario) {
            event.queryRunner.rollbackTransaction();
            throw new BadRequestException('Usuario não encontrado');
        }


        const categoria = event.entity.categoria && await this.getCategoria(event.entity.categoria.id);

        if (!categoria && event.entity.tipo === 'saida') {
            event.queryRunner.rollbackTransaction();
            throw new BadRequestException('Categoria não encontrada');
        }

        if (
            categoria && categoria.orcamento && categoria.orcamento < event.entity.valor
            && event.entity.tipo === 'saida'
        ) {
            event.queryRunner.rollbackTransaction();
            throw new BadRequestException('O valor da transação excede o orçamento da categoria');
        }

        event.entity.valor = Number(event.entity.valor);

        if (event.entity.tipo === 'entrada') {
            usuario.saldo += event.entity.valor;
        } else {
            categoria.gasto += event.entity.valor;
            usuario.saldo -= event.entity.valor;
        }

        categoria && await this.mananger.update<Categoria>(Categoria, { id: categoria.id }, {
            gasto: categoria.gasto
        });

        await this.mananger.update<Usuario>(Usuario, { id: usuario.id }, {
            saldo: usuario.saldo
        });

        return; // tudo certo
    }

    async beforeUpdate(event: UpdateEvent<Transacao>) {
        // está sendo chamado depois do afterInsert
        // para corrigir isso, basta adicionar o where: { id: event.entity.id } na query
        try {
            if (event.entity === undefined || !event.entity?.valor || !event.entity?.tipo) {
                return;
            }
            const usuario = await this.mananger.findOne(Usuario, {
                where: {
                    id: this.transacao.usuario.id
                }
            });

            if (!usuario) {
                throw new BadRequestException('Usuario não encontrado');
            }

            const categoria = await this.mananger.findOne(Categoria, {
                where: {
                    id: this.transacao.categoria.id
                }
            });

            if (!categoria && event.entity.tipo === 'saida') {
                throw new BadRequestException('Categoria não encontrada');
            }

            if (!event.entity.categoria) {
                if (event.entity.tipo === 'saida') {
                    categoria.gasto -= this.transacao.valor;
                    categoria.gasto += event.entity.valor;
                } else {
                    usuario.saldo -= this.transacao.valor;
                    usuario.saldo += event.entity.valor;
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
                await Novacategoria.save()
            }

            await usuario.save();
            categoria && await categoria.save();
        } catch (err) {
            console.error(err)
        }
    }

    async afterRemove(event: RemoveEvent<Transacao>): Promise<any> {
        if (!event.entity.usuario || !event.entity.categoria) {
            return;
        }
        const categoria = await this.mananger.findOne(Categoria, {
            where: {
                id: event.entity.categoria.id
            }
        });

        if (!categoria) {
            event.queryRunner.rollbackTransaction();
            throw new BadRequestException('Categoria não encontrada');
        }

        const usuario = await this.mananger.findOne(Usuario, {
            where: {
                id: event.entity.usuario.id
            }
        });

        if (!usuario) {
            event.queryRunner.rollbackTransaction();
            throw new BadRequestException('Usuario não encontrado');
        }

        if (event.entity.tipo === 'saida') {
            categoria.gasto -= event.entity.valor;
            usuario.saldo += event.entity.valor;
        }
        else {
            categoria.gasto += event.entity.valor;
            usuario.saldo -= event.entity.valor;
        }


        await Promise.all([
            await this.mananger.update<Usuario>(Usuario, { id: usuario.id }, {
                saldo: usuario.saldo
            }),
            await this.mananger.update<Categoria>(Categoria, { id: categoria.id }, {
                gasto: categoria.gasto
            })
        ]) // dessa forma, as duas queries são executadas ao mesmo tempo
    }
}