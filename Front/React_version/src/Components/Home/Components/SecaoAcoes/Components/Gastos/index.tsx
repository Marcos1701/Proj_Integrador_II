import { useContext, useEffect, useState } from "react";
import { TransacoesContext } from "../../../../../../Contexts/TransacoesContext";
import './Gastos.css'
import { useAuth } from "../../../../../../Contexts/AuthContext";
import { gql } from "@apollo/client";
import { Navigate } from "react-router-dom";

export interface RelacaoGasto {
    gasto: number;
    gastoMesAnterior: number;
}

interface gastoReturn {
    gasto: RelacaoGasto
}

export function Gastos() {

    const { client, user } = useAuth()

    if (!user) return <Navigate to="/login" />

    const [gastos, setGastos] = useState<RelacaoGasto>({
        gasto: 0,
        gastoMesAnterior: 0
    })

    useEffect(() => {
        const getGastos = async () => {

            const resultado = await client.query<gastoReturn>({
                query: gql`
                query GastosResult{
                    gasto(access_token: "${user.access_token}")
                    {
                      gasto,
                      gastoMesAnterior
                    }
                  }
                `
            })

            setGastos(resultado.data.gasto)
        }
        getGastos()
    }, [client])

    console.log(gastos)
    const percentual = gastos.gastoMesAnterior !== 0 ? (gastos.gasto / gastos.gastoMesAnterior) * 100 : 0
    const totalGastos = gastos.gasto

    return (
        <div className="values-layout" title="Gastos" >
            <div className="Gastos-Icon">
                <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.00688 15.2513C2.07171 15.7998 2.56888 16.1919 3.11735 16.127L12.0551 15.0706C12.6036 15.0058 12.9957 14.5086 12.9308 13.9601C12.866 13.4117 12.3688 13.0196 11.8204 13.0844L3.87567 14.0235L2.93662 6.07879C2.87179 5.53033 2.37462 5.13826 1.82615 5.20309C1.27768 5.26792 0.885616 5.76509 0.950445 6.31356L2.00688 15.2513ZM13.3607 0.380783L2.21475 14.5147L3.78519 15.7532L14.9311 1.61922L13.3607 0.380783Z" fill="white" />
                </svg>

            </div>

            <div className="Values">
                <div className="Gastos-info">
                    <h4>Gasto do mês</h4>
                    <p>R$ {totalGastos.toLocaleString('pt-br', {
                        maximumFractionDigits: 2
                    })}</p>
                </div>
                <span className={percentual > 100 ? "percentual-negativo" : "percentual-positivo"}>
                    {percentual > 100 ?
                        (percentual - 100).toLocaleString('pt-br', {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2
                        }) :
                        (100 - percentual).toLocaleString('pt-br', {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2
                        })
                    }%
                </span>
            </div>

        </div>
    )
}