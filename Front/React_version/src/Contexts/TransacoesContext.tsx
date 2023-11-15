import { createContext } from "react";
import { ITransacao } from "../Components/List/ListTransacoesCard/Components/Transacao";


export interface TransacoesContextData {
    transacoes: ITransacao[]
    setUpdated: (updated: boolean) => void
    updated: boolean
}

export const TransacoesContext = createContext<TransacoesContextData>({
    transacoes: [],
    setUpdated: () => { },
    updated: false
});