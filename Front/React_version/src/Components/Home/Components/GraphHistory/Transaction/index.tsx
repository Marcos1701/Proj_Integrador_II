import { useContext, useEffect, useState, useMemo } from "react";
import { DataContext, TransacaoData } from "../../../../../Contexts/DataContext";
import { ReactECharts } from "../../SectionCategorias/components/Echarts";
import "./Transaction.css"
import { TransacoesContext } from "../../../../../Contexts/TransacoesContext";
import { ScaleLoader } from "react-spinners";

//npm install apexcharts --save
// yarn add apexcharts
// para salvar globalmente: yarn add apexcharts --global

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
                if (valor.tipo === "saida") {
                    return acc + valor.valor
                }
                return acc
            }, 0)
        }) || []
    }

    useEffect(() => {
        if (!DadosTransacoesHistory) return
        setValores(calculateValues(DadosTransacoesHistory.history, ano))
    }, [DadosTransacoesHistory, updated, ano, loading])

    const option: echarts.EChartsOption
        = useMemo(() => ({ // para definir o width e height do gráfico, é necessário definir no css da div pai

            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: (params: any) => {
                    return `R$ ${params[0].value.toFixed(2)}`
                },
            },
            xAxis: {
                type: 'category',
                data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                axisLine: {
                    lineStyle: {
                        color: '#7949FF',
                    }
                },
                axisLabel: {
                    color: '#7949FF'
                },
                axisTick: {
                    show: false
                },
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#7949FF'
                    }
                },
                axisLabel: {
                    color: '#7949FF',
                    formatter: (value: number) => {
                        return `R$ ${value.toFixed(0)}`
                    },
                    fontSize: 12,
                    fontFamily: 'Eina03-SemiBold',
                    fontWeight: 'bold',
                    width: '100%',
                    overflow: 'break',
                    whiteSpace: 'nowrap',
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                splitArea: {
                    show: false
                },
                minInterval: 1,
                min: 0,
                max: Math.max(...valores) + Math.max(...valores) * 0.2,
            },
            // para remover as linhas de grade
            series: [{
                data: valores,
                type: 'bar',
                itemStyle: {
                    color: '#7949FF',
                    opacity: 0.8,
                    BorderRadius: 5,
                    shadowColor: '#7949FF',
                    shadowBlur: 5,
                    shadowOffsetY: 5
                },
                label: {
                    show: true,
                    color: '#FFF'
                },
                barWidth: 18,
                barMinHeight: 5,
                barGap: 0,
                barCategoryGap: 0,
                animationDelay: (idx: number) => idx * 10,
                animationDelayUpdate: (idx: number) => idx * 10,
                animationEasing: 'elasticOut',
                animationDuration: 1000,
                animationDurationUpdate: 1000,
                markLine: {
                    data: [
                        {
                            type: 'average', name: 'Média', label: {
                                show: true, position: 'end',
                                formatter: (params: any) => {
                                    return `R$ ${params.value.toFixed(0)}`
                                },
                                color: '#FFF',
                                borderColor: '#7949FF',
                            }
                        },
                    ],
                    lineStyle: {
                        color: '#7949FF',
                        type: 'dashed',
                        opacity: 0.8,
                        width: 1
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: (params: any) => {
                            return `Média: R$ ${params.data.value.toFixed(0)}`
                        },
                    },
                    animationDelay: (idx: number) => idx * 10,
                    animationDelayUpdate: (idx: number) => idx * 10,
                    animationEasing: 'elasticOut',
                    animationDuration: 1000,
                    animationDurationUpdate: 1000,
                },
                showBackground: true
            }],
            animationEasing: 'elasticOut',
            animationDuration: 1000,
            animationDurationUpdate: 1000,
            backgroundColor: 'transparent',
            textStyle: {
                fontFamily: 'Eina03-SemiBold',
                fontWeight: 'bold',
                color: '#FFF'
            },
            grid: {
                top: '5%',
                left: '10%',
                right: '10%',
                bottom: '5%',
                containLabel: true
            },

        }), [valores]);

    const Graph = () => {
        return (
            <div className="graph">
                <ReactECharts
                    option={option}
                    style={{
                        width: 'clamp(300px, 650px, 700px)',
                        height: 'clamp(100px, 130px, 250px)'
                    }}
                    key={ano}
                />
            </div>
        )
    }

    return (
        <div className="transaction-graph">
            <div className="header">
                <h2 className="title">Gastos por ano</h2>
                <select name="ano" id="ano" onChange={(e) => { setAno(Number(e.target.value)) }} value={ano} disabled={loading} title="Selecione um ano">
                    {DadosTransacoesHistory?.history.length === 0 ? <option value={0} disabled={true}>Carregando...</option> : <option value={0} disabled={true}>Selecione um ano</option>}
                    {DadosTransacoesHistory?.history.sort((a, b) => b.ano - a.ano).map((valor, index) => {
                        return <option key={index} value={valor.ano}>{valor.ano}</option>
                    })}
                </select>
            </div>
            {loading ? <ScaleLoader color="#7949FF" className="loader" content="Carregando..." />
                :
                <Graph />
            }
        </div >
    )
}