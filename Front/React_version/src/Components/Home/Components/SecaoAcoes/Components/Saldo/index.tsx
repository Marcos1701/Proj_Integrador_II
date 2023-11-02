import { ITransacao } from "../../../../../Transacao";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "../../../../../../Contexts/AuthContext";
import axios from "axios";
import './Saldo.css'


export function Saldo() {
    const { user } = useAuth();
    const [saldo, setSaldo] = useState<number>(0);

    useEffect(() => {
        async function getSaldo() {
            if (!user) return 0;
            const saldo: number = (await axios.get<ITransacao[]>(`http://localhost:3300/Transacao?id_usuario=${user.id}`)).data.reduce((acc: number, transacao: ITransacao) => {
                if (transacao.tipo === 'Entrada') {
                    return acc + transacao.Valor
                }
                return acc - transacao.Valor
            }, 0)
            setSaldo(saldo);
        }
        getSaldo();
    }, []);


    const realizarTratamentoSaldo = (saldo: number) => {
        //O tipo 'boolean' não pode ser comparável ao tipo 'number'
        // para resolver isso, é necessário fazer um switch case
        if (saldo < 1000000) {
            return saldo.toLocaleString('pt-br', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
        }

        if (saldo < 1000000000) {
            return `${(saldo / 1000000).toLocaleString('pt-br', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })} mi`.replace(',', '.')
        }

        if (saldo < 1000000000000) {
            return `${(saldo / 1000000000).toLocaleString('pt-br', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })} bi`.replace(',', '.')
        }

        if (saldo < 1000000000000000) {
            return `${(saldo / 1000000000000).toLocaleString('pt-br', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })} tri`.replace(',', '.')
        }

    }

    // o saldo é a soma de todas as transações

    return (
        <Suspense fallback={
            <div className="saldo-home-skeleton">
            </div>
        }>
            <div className="saldo-home">
                <div className="Saldo-icon">
                    <img src="/assets/Saldo/wallet.svg" alt="Saldo" />
                </div>

                <div className="saldo-info">
                    <p>Saldo</p>
                    <span>R$ {realizarTratamentoSaldo(saldo)}</span>
                </div>
            </div>
        </Suspense>
    )
}