import { createContext } from "react";
import { ITransacao } from "../Components/Transacao";

export interface TransacoesContextData {
    transacoes: ITransacao[]
    setUpdated: (updated: boolean) => void
}

export const TransacoesContext = createContext<TransacoesContextData>({
    transacoes: [],
    setUpdated: () => { }
});