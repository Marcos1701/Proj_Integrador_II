import { useContext, useState } from "react";
import { IMeta, Meta } from "./Components/Meta";
import { useAuth } from "../../../Contexts/AuthContext";
import { MetasContext } from "../../../Contexts/MetasContext";
import './ListMetas.css'

interface ListMetasProps {
    pagination?: boolean
    orderSelect?: boolean
    searchInput?: boolean
    limit?: number
    page?: number
    classname?: string
}


export function ListMetas(
    {
        pagination = true,
        // orderSelect = false,
        // searchInput = false,
        limit = 2,
        page = 1,
        classname = "lista-metas"
    }: ListMetasProps
) {
    const { user } = useAuth();
    if (!user) return <p>Erro ao carregar metas</p>
    const metas: IMeta[] = useContext(MetasContext);
    const [pageAtual, setPageAtual] = useState<number>(page);

    return (

        <div className={classname}>
            {/* {searchInput || orderSelect && (
                    <div className="search-filter">
                        {searchInput && <Searchdiv />}
                        {orderSelect && <Orderdiv />}
                    </div>
                )} */}
            <ul className="list-values-2columns" id="lista_metas">
                {metas.length === 0 && <li className="empty">Nenhuma meta cadastrada</li>}
                {
                    metas
                        .slice(page * limit - limit, page * limit)
                        .map(
                            (meta: IMeta) => <li key={meta.id} className="li-meta"> <Meta meta={meta} key={meta.id} /></li>
                        )
                }
            </ul>

            {
                pagination && <div className="pagination">
                    <a className={
                        pageAtual === 1 ? "pagination-button-disabled" : "pagination-button"} onClick={() => {
                            if (pageAtual > 1) {
                                setPageAtual(pageAtual - 1);
                            }
                        }}
                        id="previous"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <g clip-path="url(#clip0_206_145)">
                                <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" fill="black" />
                            </g>
                            <defs>
                                <clipPath id="clip0_206_145">
                                    <rect width="24" height="24" fill="white" />
                                </clipPath>
                            </defs>
                        </svg></a>
                    <a className="pagination-button-active">{pageAtual}</a>
                    {pageAtual < Math.ceil(metas.length / limit) && <a className="pagination-button">{pageAtual + 1}</a>}
                    {pageAtual + 1 < Math.ceil(metas.length / limit) && <a className="pagination-button">{pageAtual + 2}</a>}
                    <a className="pagination-button">...</a>
                    {pageAtual < Math.ceil(metas.length / limit) && <a className="pagination-button">{Math.ceil(metas.length / limit)}</a>}
                    <a className={
                        pageAtual === Math.ceil(metas.length / limit) ? "pagination-button-disabled" : "pagination-button"
                    } onClick={() => {
                        if (pageAtual < Math.ceil(metas.length / limit)) {
                            setPageAtual(pageAtual + 1);
                        }
                    }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <g clip-path="url(#clip0_206_57)">
                                <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="black" />
                            </g>
                            <defs>
                                <clipPath id="clip0_206_57">
                                    <rect width="24" height="24" fill="white" />
                                </clipPath>
                            </defs>
                        </svg></a>
                </div>
            }
        </div>
    )
}