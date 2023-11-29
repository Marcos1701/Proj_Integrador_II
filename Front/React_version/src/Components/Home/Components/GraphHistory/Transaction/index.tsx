import { useContext } from "react";
import { DataContext } from "../../../../../Contexts/DataContext";

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
    const { DadosTransacoesHistory } = useContext(DataContext);

    const data = DadosTransacoesHistory.history;

    const dados = data.map((ano) => {
        return ano.meses.map((mes) => {
            return mes.transacoes.map((transacao) => {
                return transacao.valor;
            })
        })
    }) // array de 12 arrays, cada um com os valores das transações de cada mês


    const option: echarts.EChartsOption = { // grafico de barras anual, de janeiro a dezembro
        title: {
            text: 'Histórico de transações',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        toolbox: {
            show: true,
            feature: {
                magicType: { show: true, type: ['line', 'bar'] },
                saveAsImage: { show: true }
            }
        },
        xAxis: {
            type: 'category',
            data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            axisLabel: {
                rotate: 45
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: dados,
        }]
    };

}