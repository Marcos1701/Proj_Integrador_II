import { createContext } from "react";
import { ICategoria } from "../Components/Categoria";

export const CategoriasContext = createContext<ICategoria[]>([]);