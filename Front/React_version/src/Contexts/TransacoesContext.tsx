import { createContext } from "react";
import { ITransacao } from "../Components/List/ListTransacoesCard/Components/Transacao";
import { OrderElements } from "../providers/CategoriasProvider";

export enum SortFieldTransacao {
    ID = 'id',
    TIPO = 'tipo',
    VALOR = 'valor',
    TITULO = 'titulo',
    DESCRICAO = 'descricao',
    DATA = 'data',
}

export interface TransacoesContextData {
    transacoes: ITransacao[]
    setUpdated: (updated: boolean) => void
    updated: boolean,
    ordem: OrderElements,
    setOrdem: (order: OrderElements) => void,
    ordenarPor: SortFieldTransacao,
    setOrdenarPor: (orderby: SortFieldTransacao) => void,
    search: string,
    setSearch: (search: string) => void
    loading: boolean,
    pagina: number,
    setPagina: (page: number) => void,
    limite: number,
    setLimite: (limit: number) => void,
    qtd: number
}

export const TransacoesContext = createContext<TransacoesContextData>({
    transacoes: [],
    setUpdated: () => { },
    updated: false,
    ordem: OrderElements.ASC,
    setOrdem: () => { },
    ordenarPor: SortFieldTransacao.DATA,
    setOrdenarPor: () => { },
    search: '',
    setSearch: () => { },
    loading: true,
    pagina: 1,
    setPagina: () => { },
    limite: 3,
    setLimite: () => { },
    qtd: 0
});