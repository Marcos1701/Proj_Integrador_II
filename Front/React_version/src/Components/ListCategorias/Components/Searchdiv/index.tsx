import { useContext } from "react";
import { CategoriasOrderContext, CategoriasOrderContextData } from "../../../../Contexts/CategoriasContext";

export const Searchdiv = () => {

    const { search } = useContext<CategoriasOrderContextData>(CategoriasOrderContext);

    const { setSearch } = search;


    return (<div className="search-filter">
        <input type="text" placeholder="Pesquisar" onChange={(e) => setSearch(e.target.value)} />
    </div>)
}