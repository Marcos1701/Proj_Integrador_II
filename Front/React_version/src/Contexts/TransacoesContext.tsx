import { createContext } from "react";
import { ITransacao } from "../Components/List/ListTransacoesCard/Components/Transacao";
import { OrderElements } from "../providers/CategoriasProvider";

export enum ordenarTransacoes {
    titulo = "titulo",
    descricao = "descricao",
    valor = "valor",
    entrada = 'entrada',
    saida = 'saida',
    data = "data"
}

export interface TransacoesContextData {
    transacoes: ITransacao[]
    setUpdated: (updated: boolean) => void
    updated: boolean,
    ordem: OrderElements,
    setOrdem: (order: OrderElements) => void,
    ordenarPor: ordenarTransacoes,
    setOrdenarPor: (orderby: ordenarTransacoes) => void,
    search: string,
    setSearch: (search: string) => void
}

export const TransacoesContext = createContext<TransacoesContextData>({
    transacoes: [],
    setUpdated: () => { },
    updated: false,
    ordem: OrderElements.ASC,
    setOrdem: () => { },
    ordenarPor: ordenarTransacoes.data,
    setOrdenarPor: () => { },
    search: '',
    setSearch: () => { }
});