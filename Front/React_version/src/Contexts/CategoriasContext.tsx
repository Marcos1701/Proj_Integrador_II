import { createContext } from "react";
import { ordenarCategorias } from "../providers/CategoriasProvider";
import { ICategoria } from "../Components/List/ListCategorias/Components/Categoria";

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