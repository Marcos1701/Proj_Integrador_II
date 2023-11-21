import { createContext } from "react";
import { IMeta } from "../Components/List/ListMetas/Components/Meta";

export interface IMetaContext {
    metas: IMeta[];
    updated: boolean;
    setUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}


export const MetasContext = createContext<IMetaContext>({} as IMetaContext);