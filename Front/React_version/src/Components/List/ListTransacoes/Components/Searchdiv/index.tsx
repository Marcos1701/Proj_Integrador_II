import { useContext } from "react";
import { TransacoesContext, TransacoesContextData } from "../../../../../Contexts/TransacoesContext";

export const Searchdiv = () => {
    const { search, setSearch } = useContext<TransacoesContextData>(TransacoesContext);

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