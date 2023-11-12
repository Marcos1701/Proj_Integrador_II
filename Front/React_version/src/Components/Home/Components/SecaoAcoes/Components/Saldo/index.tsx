import { useContext, useEffect, useState } from "react";
import './Saldo.css'
import { TransacoesContext, TransacoesContextData } from "../../../../../../Contexts/TransacoesContext";
import axios from "axios";
import { api_url, useAuth } from "../../../../../../Contexts/AuthContext";

export const realizarTratamentoValor = (valor: number) => {

    if (valor < 10000) {
        return `${valor.toLocaleString('pt-br', {
            maximumFractionDigits: 0
        })}`.replace(',', '.')
    }

    if (valor <= 1000000) {
        return `${valor.toLocaleString('pt-br', {
            maximumFractionDigits: 0
        })} mil`.replace(',', '.')
    }


    if (valor < 1000000000) {
        return `${(valor / 1000000).toLocaleString('pt-br', {
            maximumFractionDigits: 0
        })} mi`.replace(',', '.')
    }

    if (valor < 1000000000000) {
        return `${(valor / 1000000000).toLocaleString('pt-br', {
            maximumFractionDigits: 0
        })} bi`.replace(',', '.')
    }

}

export function Saldo() {
    const { transacoes }: TransacoesContextData = useContext<TransacoesContextData>(TransacoesContext);
    const [saldo, setSaldo] = useState<number>(0);
    const { user } = useAuth();
    if (!user) return <p>Usuário não encontrado</p>

    useEffect(() => {
        const getSaldo = async () => {
            const saldo: number = (await axios.get<number>(`${api_url}usuarios/saldo`, {
                headers: {
                    getAuthorization: true,
                    Authorization: user.access_token
                }
            })).data
            setSaldo(saldo);
        }
        getSaldo()
    }, [transacoes])

    // o saldo é a soma de todas as transações

    return (

        <div className="saldo-home">
            <div className="Saldo-icon">
                <img src="/assets/Saldo/wallet.svg" alt="Saldo" />
            </div>

            <div className="saldo-info">
                <p>Saldo</p>
                <span className={saldo < 0 ? "saldo-negativo" : "saldo-positivo"}>{realizarTratamentoValor(saldo)}</span>
            </div>
        </div>

    )
}