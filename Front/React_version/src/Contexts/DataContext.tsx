import { createContext } from "react";

export interface CategoriaData {
    id: string
    nome: string
    gasto: number
    qtdTransacoes: number
}

export interface CategoriasDataResponse {
    dados: CategoriaData[]
    totalGasto: number
}

export interface TransacaoData {
    id: string
    titulo: string
    valor: number
    data: Date
    tipo: string
}


export interface TransacoesDataResponse {
    dados: TransacaoData[]
    totalGasto: number
    totalEntrada: number
}

export interface MetaData {
    id: string
    titulo: string
    valor: number
    valorAtual: number
    dataLimite: Date
    dataCriacao: Date
    progresso: number
}

export interface MetasDataResponse {
    dados: MetaData[]
}

export interface TransacoesHistory {
    history: {
        ano: number,
        meses: {
            mes: number,
            transacoes: TransacaoData[]
        }[]
    }[]
}

export interface CategoriasHistory {
    history: {
        [categoria: string]: {
            [ano: number]: {
                [mes: number]: {
                    transacoes: TransacaoData[],
                    nome: string,
                    id: string
                }
            }
        }
    }
}

export interface CategoriasHistoryData {
    data: CategoriasHistory[]
}

export interface DataContextData {
    DadosCategoria: CategoriasDataResponse
    DadosTransacao: TransacoesDataResponse
    DadosMeta: MetasDataResponse,
    DadosTransacoesHistory: TransacoesHistory,
    setTransacoesHistoryYear: (year: number) => void,
    setTransacoesHistoryMonth: (month: number) => void,
    DadosCategoriasHistory: CategoriasHistoryData,
    loading: boolean,
    setUpdated: (updated: boolean) => void
}


export const DataContext = createContext<DataContextData>({} as DataContextData);