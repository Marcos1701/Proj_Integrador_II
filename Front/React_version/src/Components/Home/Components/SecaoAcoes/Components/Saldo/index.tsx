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

interface SaldoData {
    saldo: number,
    saldoAnterior: number
}

export function Saldo() {
    const { updated }: TransacoesContextData = useContext<TransacoesContextData>(TransacoesContext);
    const [saldo, setSaldo] = useState<number>(0);
    const [SaldoAnterior, setSaldoAnterior] = useState<number>(0);

    const { user } = useAuth();
    if (!user) return <p>Usuário não encontrado</p>

    useEffect(() => {
        const getdadosSaldo = async () => {
            const response = (await axios.get<SaldoData>(`${api_url}usuarios/saldo`, {
                headers: {
                    getAuthorization: true,
                    Authorization: user.access_token
                }
            }))

            if (!response.data) return

            if (response.status !== 200) return;

            const { saldo, saldoAnterior } = response.data

            setSaldo(saldo);
            setSaldoAnterior(saldoAnterior)
        }
        getdadosSaldo()
    }, [updated])


    // se o saldo atual é -1200 e o saldo anterior é 800, o percentual é positivo, pois o saldo atual é maior que o anterior
    const percentual = SaldoAnterior === 0 ? 100 : ((saldo - SaldoAnterior) / SaldoAnterior) * 100 // (-1200 - 800) / 800 = -2000 / 800 = -2.5 * 100 = -250%

    return (

        <div className="values-layout">
            <div className="Saldo-icon">
                <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.7618 0.856683C12.6826 0.310102 12.1753 -0.0688157 11.6288 0.0103471L2.7217 1.30039C2.17512 1.37955 1.7962 1.88681 1.87536 2.4334C1.95453 2.97998 2.46179 3.3589 3.00837 3.27973L10.9258 2.13303L12.0725 10.0504C12.1516 10.597 12.6589 10.9759 13.2055 10.8968C13.7521 10.8176 14.131 10.3103 14.0518 9.76375L12.7618 0.856683ZM1.80116 16.0193L12.5733 1.59847L10.9709 0.401571L0.19884 14.8224L1.80116 16.0193Z" fill="white" />
                </svg>
            </div>

            <div className="Values" id="saldo">
                <div className="saldo-info">
                    <p>Saldo</p>
                    <span className={saldo < 0 ? "saldo-negativo" : "saldo-positivo"}>{realizarTratamentoValor(saldo)}</span>
                </div>
                <span className={percentual < 100 ? "percentual-negativo" : "percentual-positivo"}>
                    {percentual.toLocaleString('pt-br', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                    }).replace('-', '') // se o percentual for negativo, o sinal de menos é removido pois ele é adicionada via css com a estilização específica
                    }%
                </span>
            </div>
        </div>


    )
}