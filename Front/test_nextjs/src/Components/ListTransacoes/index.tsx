import { ICategoria } from "@/Components/Categoria";
import { ITransacao, Transacao } from "@/Components/Transacao";
import { useUser } from "@/EncapsulatedContext";
import { Suspense } from "react";


interface IListTransacoesProps {
    page?: number;
    limit?: number;
    pagination?: boolean;
}

/* 
SyntaxError: Unexpected token < in JSON at position 0
    at JSON.parse (<anonymous>)
    at parseJSONFromBytes (node:internal/deps/undici/undici:6571:19)
    at successSteps (node:internal/deps/undici/undici:6545:27)
    at node:internal/deps/undici/undici:1211:60
    at node:internal/process/task_queues:140:7
    at AsyncResource.runInAsyncScope (node:async_hooks:203:9)
    at AsyncResource.runMicrotask (node:internal/process/task_queues:137:8)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)

    // para resolver esse erro, basta adicionar o header 'Content-Type': 'application/json' na requisição
*/

export async function ListTransacoes({ page = 1, limit = 10 }: IListTransacoesProps) {

    const user = await useUser();

    const transacoes: ITransacao[] = await fetch(`http://localhost:3300/Transacao?id_usuario=${user.id}`, {
        cache: 'no-cache',
        next: {
            revalidate: 1
        },
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => { return res.json() }).catch(err => {
        console.log(`Erro: ${err}`)
        return []
    })

    const categorias: ICategoria[] = await fetch(`http://localhost:3300/Categoria?id_usuario=${user.id}`, {
        cache: 'no-cache',
        next: {
            revalidate: 1
        },
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).catch(err => {
        console.log(`Erro: ${err}`)
        return []
    })

    return (
        <Suspense fallback={
            <div className="transacoes-home-skeleton">
            </div>
        }>
            <div className="transacoes-home">
                {
                    transacoes
                        .slice((page - 1) * limit, page * limit)
                        .map(
                            (transacao: ITransacao) => {
                                const categoria: ICategoria | undefined = categorias.find(
                                    (categoria: ICategoria) => {
                                        return categoria.id === transacao.id_categoria
                                    }
                                );

                                if (!categoria) {
                                    return <p>Erro: Categoria não encontrada</p>
                                }

                                return (
                                    <Transacao
                                        transacao={transacao}
                                        categoria={categoria}
                                    />
                                )
                            }
                        )
                }
            </div>
        </Suspense>
    )
}