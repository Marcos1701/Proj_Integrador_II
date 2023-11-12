import { useContext, useState } from "react";
import { IMeta, Meta } from "../Meta";
import { useAuth } from "../../Contexts/AuthContext";
import { MetasContext } from "../../Contexts/MetasContext";
import './ListMetas.css'

interface ListMetasProps {
    pagination?: boolean
    orderSelect?: boolean
    searchInput?: boolean
    limit?: number
    page?: number
}


export function ListMetas(
    {
        pagination = false,
        orderSelect = false,
        searchInput = false,
        limit = 2,
        page = 1
    }: ListMetasProps
) {
    const { user } = useAuth();
    if (!user) return <p>Erro ao carregar metas</p>
    const metas: IMeta[] = useContext(MetasContext);
    const [pageAtual, setPageAtual] = useState<number>(page);

    return (
        <>

            <div className="list-values-2columns" id="lista-metas">
                {/* {searchInput || orderSelect && (
                    <div className="search-filter">
                        {searchInput && <Searchdiv />}
                        {orderSelect && <Orderdiv />}
                    </div>
                )} */}
                <ul className="list-values-2columns">
                    {
                        metas
                            .slice(page * limit - limit, page * limit)
                            .map(
                                (meta: IMeta) => <li key={meta.id}> <Meta meta={meta} key={meta.id} /></li>
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
                        {pageAtual < Math.ceil(metas.length / limit) && <button>{pageAtual + 1}</button>}
                        {pageAtual + 1 < Math.ceil(metas.length / limit) && <button>{pageAtual + 2}</button>}
                        <p className="dots">...</p>
                        {pageAtual < Math.ceil(metas.length / limit) && <button>{Math.ceil(metas.length / limit)}</button>}
                        <button onClick={() => {
                            if (pageAtual < Math.ceil(metas.length / limit)) {
                                setPageAtual(pageAtual + 1);
                            }
                        }}>Próximo</button>
                    </div>
                }
            </div>
        </ >
    )
}