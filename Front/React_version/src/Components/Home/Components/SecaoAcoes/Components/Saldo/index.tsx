import { ITransacao } from "../../../../../Transacao";
import { useContext, useEffect, useState } from "react";
import './Saldo.css'
import { TransacoesContext } from "../../../../../../Contexts/TransacoesContext";
import axios from "axios";
import { api_url, useAuth } from "../../../../../../Contexts/AuthContext";


export function Saldo() {
    const transacoes: ITransacao[] = useContext<ITransacao[]>(TransacoesContext);
    const [saldo, setSaldo] = useState<number>(0);
    const { user } = useAuth();
    if (!user) return <p>Usuário não encontrado</p>

    useEffect(() => {
        const getSaldo = async () => {
            const saldo: number = await (await axios.get<number>(`${api_url}usuarios/saldo`, {
                headers: {
                    getAuthorization: true,
                    Authorization: user.access_token
                }
            })).data
            setSaldo(saldo);
        }
        getSaldo()
    }, [transacoes])

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

        <div className="saldo-home">
            <div className="Saldo-icon">
                <img src="/assets/Saldo/wallet.svg" alt="Saldo" />
            </div>

            <div className="saldo-info">
                <p>Saldo</p>
                <span>R$ {realizarTratamentoSaldo(saldo)}</span>
            </div>
        </div>

    )
}