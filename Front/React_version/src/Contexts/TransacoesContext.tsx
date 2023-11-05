import { createContext } from "react";
import { ITransacao } from "../Components/Transacao";


export const TransacoesContext = createContext<ITransacao[]>([]);