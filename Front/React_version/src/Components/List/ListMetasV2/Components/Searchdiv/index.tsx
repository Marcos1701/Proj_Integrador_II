import { useContext } from "react";
import { IMetaContext, MetasContext } from "../../../../../Contexts/MetasContext";

export const Searchdiv = () => {
    const { search, setSearch } = useContext<IMetaContext>(MetasContext);

    return (
        <div className="search-filter">
            <input type="text" placeholder="Pesquisar" onChange={(e) => {
                if (e.target.value.length > 0 && e.target.value !== search) {
                    setSearch(e.target.value)
                }
                else if (e.target.value.length === 0) {
                    setSearch('')
                }
            }} />
        </div>
    )
}