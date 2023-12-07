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
        categorias:
        {
            id: string,
            nome: string,
            history: {
                anos: {
                    ano: number,
                    meses: {
                        mes: number,
                        transacoes: TransacaoData[]
                    }[]
                }[]
            }[]
        }
    }
}

export interface DataContextData {
    DadosCategoria: CategoriasDataResponse | null,
    DadosTransacao: TransacoesDataResponse | null,
    DadosMeta: MetasDataResponse | null,
    DadosTransacoesHistory: TransacoesHistory | null,
    setTransacoesHistoryYear: (year: number) => void,
    setTransacoesHistoryMonth: (month: number) => void,
    DadosCategoriasHistory: CategoriasHistory | null,
    loading: boolean,
    setUpdated: (updated: boolean) => void
}


export const DataContext = createContext<DataContextData>({} as DataContextData);