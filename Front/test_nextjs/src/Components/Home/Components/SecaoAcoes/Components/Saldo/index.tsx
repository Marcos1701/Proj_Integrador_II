import { ITransacao } from "@/Components/Transacao";
import { useAuth } from "@/Contexts/AuthContext";
import { Suspense } from "react";


export async function Saldo() {
    const { user } = useAuth();

    // o saldo é a soma de todas as transações
    const saldo = await fetch(`http://localhost:3000/Transacao?id_usuario=${user!.id}`)
        .then(res => res.json().then(transacoes => {
            return transacoes.reduce((acc: number, transacao: ITransacao) => {
                if (transacao.tipo === 'Entrada') {
                    return acc + transacao.valor
                }
                return acc - transacao.valor
            }, 0)
        })
        ).catch(err => {
            console.log(err)
            return []
        })

    return (
        <Suspense fallback={
            <div className="saldo-home-skeleton">
            </div>
        }>
            <div className="saldo-home">
                <div className="Saldo-icon">
                    <img src="/icons/saldo.svg" alt="saldo" />
                </div>

                <div className="saldo-info">
                    <h3>Saldo</h3>
                    <span>{saldo}</span>
                </div>
            </div>
        </Suspense>
    )
}