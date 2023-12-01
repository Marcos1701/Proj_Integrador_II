import { useContext, useEffect, useState, useMemo } from "react";
import { DataContext, TransacaoData } from "../../../../../Contexts/DataContext";
import { ReactECharts } from "../../SectionCategorias/components/Echarts";
import "./Transaction.css"
import { TransacoesContext } from "../../../../../Contexts/TransacoesContext";
import { ScaleLoader } from "react-spinners";

export function GraphTransactionHistory() {
    const { DadosTransacoesHistory, loading } = useContext(DataContext);
    const { updated } = useContext(TransacoesContext)

    const [valores, setValores] = useState<number[]>([])

    const [ano, setAno] = useState<number>(new Date().getFullYear());

    const calculateValues = (
        history: {
            ano: number,
            meses: {
                mes: number,
                transacoes: TransacaoData[]
            }[]
        }[],
        ano: number
    ) => {
        return history.find((valor) => valor.ano === ano)?.meses.map((valor) => {
            return valor.transacoes.reduce((acc, valor) => {
                return acc + valor.valor
            }, 0)
        }) || []
    }

    useEffect(() => {
        if (!DadosTransacoesHistory) return

        setValores(calculateValues(DadosTransacoesHistory.history, ano))

    }, [DadosTransacoesHistory, updated, ano])

    const option: echarts.EChartsOption
        = useMemo(() => ({
            title: {
                text: 'Gastos por ano',
                textStyle: {
                    color: '#7949FF',
                    fontSize: 20,
                    fontWeight: 'bold'
                },
                left: 'center',
                top: '10px'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                axisLine: {
                    lineStyle: {
                        color: '#7949FF'
                    }
                },
                axisLabel: {
                    color: '#7949FF'
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#7949FF'
                    }
                },
                axisLabel: {
                    color: '#7949FF'
                }
            },
            series: [{
                data: valores,
                type: 'bar',
                itemStyle: {
                    color: '#7949FF',
                    opacity: 0.8,
                    BorderRadius: 5,
                },
                label: {
                    show: true,
                    color: '#7949FF'
                }
            }]
        }), [valores]);

    return (
        <div className="transaction-graph">
            <select name="ano" id="ano" onChange={(e) => { setAno(Number(e.target.value)) }} value={ano} disabled={loading} title="Selecione um ano">
                {DadosTransacoesHistory?.history.length === 0 ? <option value={0} disabled={true}>Carregando...</option> : <option value={0} disabled={true}>Selecione um ano</option>}
                {DadosTransacoesHistory?.history.sort((a, b) => b.ano - a.ano).map((valor, index) => {
                    return <option key={index} value={valor.ano}>{valor.ano}</option>
                })}
            </select>
            {loading ? <ScaleLoader color="#7949FF" className="loader" content="Carregando..." />
                :
                <ReactECharts
                    option={option}
                    style={{ height: "250px", width: "550px", gap: "10px" }}
                />
            }
        </div >
    )
}