import { Categoria, ICategoria } from "../Categoria";
import { useContext, useState } from "react";
import { CategoriasContext } from "../../Contexts/CategoriasContext";
import { Orderdiv } from "./Components/Orderdiv";
import { Searchdiv } from "./Components/Searchdiv";


interface ListCategoriasProps {
    pagination?: boolean
    orderSelect?: boolean
    searchInput?: boolean
    limit?: number
    page?: number
}

export function ListCategorias(
    {
        pagination = false,
        orderSelect = false,
        searchInput = false,
        limit = 2,
        page = 1
    }: ListCategoriasProps
) {

    const [pageAtual, setPageAtual] = useState<number>(page);

    const categorias: ICategoria[] = useContext<ICategoria[]>(CategoriasContext);

    return (
        <>
            <div className="lista-categorias">

                {searchInput || orderSelect && (
                    <div className="search-filter">
                        {searchInput && <Searchdiv />}
                        {orderSelect && <Orderdiv />}
                    </div>
                )}

                <ul className="list-values-2columns">
                    {
                        categorias.slice(page * limit - limit, page * limit)
                            .map(
                                (categoria: ICategoria) => <li key={categoria.id}><Categoria categoria={categoria} key={categoria.id} /> </li>
                            )
                    }
                </ul>
                {
                    pagination && <div className="pagination">
                        <button onClick={() => {
                            if (pageAtual > 1) {
                                setPageAtual(pageAtual - 1);
                            }
                        }}>Anterior</button>
                        <button>{pageAtual}</button>
                        {pageAtual < Math.ceil(categorias.length / limit) && <button>{pageAtual + 1}</button>}
                        {pageAtual + 1 < Math.ceil(categorias.length / limit) && <button>{pageAtual + 2}</button>}
                        <p className="dots">...</p>
                        {pageAtual < Math.ceil(categorias.length / limit) && <button>{Math.ceil(categorias.length / limit)}</button>}
                        <button onClick={() => {
                            if (pageAtual < Math.ceil(categorias.length / limit)) {
                                setPageAtual(pageAtual + 1);
                            }
                        }}>Próximo</button>
                    </div>
                }
            </div>
        </>
    )

}

// o codigo acima possui um erro, ele esta na linha 121, pois o botão de proximo esta aparecendo mesmo quando não tem mais paginas,