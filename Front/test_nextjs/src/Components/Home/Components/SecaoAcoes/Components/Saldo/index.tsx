import { ITransacao } from "@/Components/Transacao";
import { useUser } from "@/EncapsulatedContext";
import { Suspense } from "react";


export async function Saldo() {
    const user = await useUser();

    // o saldo é a soma de todas as transações
    const saldo = await fetch(`http://localhost:3300/Transacao?id_usuario=${user.id}`)
        .then(res => res.json().then(transacoes => {
            return transacoes.reduce((acc: number, transacao: ITransacao) => {
                if (transacao.tipo === 'Entrada') {
                    return acc + transacao.Valor
                }
                return acc - transacao.Valor
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