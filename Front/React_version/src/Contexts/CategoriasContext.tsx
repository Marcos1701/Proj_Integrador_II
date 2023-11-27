import { createContext } from "react";
import { ordenarCategorias, OrderElements } from "../providers/CategoriasProvider";
import { ICategoria } from "../Components/List/ListCategorias/Components/Categoria";

interface orderData {
    ordem: OrderElements
    setOrdem: (order: OrderElements) => void
}

interface orderbyData {
    ordenarPor: ordenarCategorias
    setOrdenarPor: (orderby: ordenarCategorias) => void
}

interface searchData {
    search: string
    setSearch: (search: string) => void
}

export interface CategoriasOrderContextData {
    orderby: orderbyData
    order: orderData
    search: searchData
    setUpdated: (updated: boolean) => void
    loading: boolean
}

export const CategoriasContext = createContext<ICategoria[]>([]);
export const CategoriasOrderContext = createContext<CategoriasOrderContextData>({} as CategoriasOrderContextData);