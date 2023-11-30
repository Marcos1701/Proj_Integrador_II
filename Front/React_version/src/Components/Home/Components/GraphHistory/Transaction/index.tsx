import { useContext, useState } from "react";
import { DataContext } from "../../../../../Contexts/DataContext";
import { ReactECharts } from "../../SectionCategorias/components/Echarts";
import "./Transaction.css"
/* 
export interface TransacoesHistory {
    history: {
        ano: number,
        meses: {
            mes: number,
            transacoes: TransacaoData[]
        }[]
    }[]
}
*/


export function GraphTransactionHistory() {
    const { DadosTransacoesHistory, loading } = useContext(DataContext);

    const data = DadosTransacoesHistory.history.map((ano) => {
        return {
            ano: ano.ano,
            gastos: ano.meses.map((mes, index) => {
                if (mes.mes === index + 1) {
                    return mes.transacoes.reduce((acc, transacao) => {
                        if (transacao.tipo === 'gasto') {
                            return acc + transacao.valor
                        }
                        return acc
                    }, 0)
                }
                return 0
            }) // retorna um array com os valores de cada mes
        }
    })

    const [ano, setAno] = useState<number>(data.length === 0 ? 0 : data.sort((a, b) => a.ano - b.ano)[0].ano);
    // console.log(data.find((valor) => valor.ano === ano))

    const option: echarts.EChartsOption = { // grafico de barras anual, de janeiro a dezembro
        title: {
            text: 'Histórico de gastos',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#ccc'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
        },
        xAxis: {
            type: 'category',
            data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: data.find((valor) => valor.ano === ano)?.gastos,
                type: 'bar',
                color: '#ff0000',
            }],
    };

    return (
        <div className="transaction-graph">
            <select name="ano" id="ano" onChange={(e) => { setAno(Number(e.target.value)) }} value={ano} disabled={loading} title="Selecione um ano">
                {data.length === 0 ? <option value={0} disabled={true}>Carregando...</option> : <option value={0} disabled={true}>Selecione um ano</option>}
                {data.map((valor) => {
                    return <option value={valor.ano}>{valor.ano}</option>
                })}
            </select>
            <ReactECharts
                option={option}
                style={{ height: "250px", width: "550px", gap: "10px" }}
            />
        </div >
    )

}