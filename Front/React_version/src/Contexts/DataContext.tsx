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


export interface DataContextData {
    DadosCategoria: CategoriasDataResponse
    DadosTransacao: TransacoesDataResponse
    DadosMeta: MetasDataResponse,
    loading: boolean,
    setUpdated: (updated: boolean) => void
}


export const DataContext = createContext<DataContextData>({} as DataContextData);