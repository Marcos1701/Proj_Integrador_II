import { createContext } from "react";
import { IMeta } from "../Components/List/ListMetas/Components/Meta";
import { OrderElements } from "../providers/CategoriasProvider";

export enum ordenarMetas {
    titulo = "titulo",
    valor = "valor",
    dataLimite = "dataLimite",
    dataCriacao = "dataCriacao",
    progresso = "progresso"
}


export interface IMetaContext {
    metas: IMeta[];
    updated: boolean;
    setUpdated: React.Dispatch<React.SetStateAction<boolean>>;
    ordem: OrderElements,
    setOrdem: (order: OrderElements) => void,
    ordenarPor: ordenarMetas,
    setOrdenarPor: (orderby: ordenarMetas) => void,
    search: string,
    setSearch: (search: string) => void
}


export const MetasContext = createContext<IMetaContext>({} as IMetaContext);