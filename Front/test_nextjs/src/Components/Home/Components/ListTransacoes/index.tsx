import { ICategoria } from "@/Components/Categoria";
import { ITransacao, Transacao } from "@/Components/Transacao";
import { useAuth } from "@/Contexts/AuthContext";
import { Suspense } from "react";

export async function ListTransacoes() {

    const { user } = useAuth();
    const transacoes: ITransacao[] = await fetch(`http://localhost:3000/Transacao/${user!.id}`).then(res => res.json()).catch(err => {
        console.log(err)
        return []
    })
    const categorias: ICategoria[] = await fetch(`http://localhost:3000/Categoria/${user!.id}`).then(res => res.json()).catch(err => {
        console.log(err)
        return []
    })

    return (
        <Suspense fallback={
            <div className="transacoes-home-skeleton">
            </div>
        }>
            <div className="transacoes-home">
                {
                    transacoes.map(
                        (transacao: ITransacao) => {
                            const categoria: ICategoria | undefined = categorias.find(
                                (categoria: ICategoria) => categoria.id === transacao.id_categoria
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