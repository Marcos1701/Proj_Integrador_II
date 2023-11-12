import { createContext } from "react";
import { ICategoria } from "../Components/Categoria";
import { ordenarCategorias } from "../providers/CategoriasProvider";

interface orderData {
    order: ordenarCategorias
    setOrder: (order: ordenarCategorias) => void
}

interface searchData {
    search: string
    setSearch: (search: string) => void
}

export interface CategoriasOrderContextData {
    order: orderData
    search: searchData
    setUpdated: (updated: boolean) => void
}

export const CategoriasContext = createContext<ICategoria[]>([]);
export const CategoriasOrderContext = createContext<CategoriasOrderContextData>({} as CategoriasOrderContextData);