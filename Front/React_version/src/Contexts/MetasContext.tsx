import { createContext } from "react";
import { IMeta } from "../Components/List/ListMetas/Components/Meta";

export const MetasContext = createContext<IMeta[]>([]);