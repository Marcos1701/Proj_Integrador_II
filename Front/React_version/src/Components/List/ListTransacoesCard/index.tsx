import { CategoriasContext } from "../../../Contexts/CategoriasContext";
import { TransacoesContext, TransacoesContextData } from "../../../Contexts/TransacoesContext";
import { ICategoria } from "../ListCategorias/Components/Categoria";
import { ITransacao, Transacao } from "./Components/Transacao"
import { useContext, useState } from "react";
import './ListTransacoes.css'
import { Orderdiv } from "./Components/Orderdiv";
import { Searchdiv } from "./Components/Searchdiv";


interface IListTransacoesProps {
    page?: number; // pagina atual
    limit?: number; // limite de transacoes por pagina
    pagination?: boolean; // se deve exibir a paginação
    classname?: string;
    format?: 'list' | 'card';
    orderSelect?: boolean;
    searchInput?: boolean;
}

export function ListTransacoesCard(
    {
        page = 1,
        limit = 4,
        pagination = true,
        classname = "list_transacoes",
        orderSelect = true,
        searchInput = true,
    }: IListTransacoesProps) {

    const { transacoes }: TransacoesContextData = useContext(TransacoesContext)
    const categorias: ICategoria[] = useContext(CategoriasContext)
    const [pageAtual, setPageAtual] = useState<number>(page);

    return (
        <div className={classname}>
            {(searchInput || orderSelect) && (
                <div className="search-order">
                    {orderSelect && <Orderdiv />}
                    {searchInput && <Searchdiv />}
                </div>
            )}
            <ul className="list-values-2columns" id="listTransacoes">
                {transacoes.length === 0 && <li className="empty">Nenhuma transação cadastrada</li>}
                {
                    transacoes
                        .slice((pageAtual - 1) * limit, pageAtual * limit)
                        .map(
                            (transacao: ITransacao) => {
                                const categoria: ICategoria | undefined = categorias.find(
                                    (categoria: ICategoria) => {
                                        return categoria.id === transacao.categoriaid
                                    }
                                );

                                if (!categoria) {
                                    return <></>
                                }

                                return (
                                    <li key={transacao.id}>
                                        <Transacao
                                            transacao={transacao}
                                            categoria={categoria}
                                        />
                                    </li>
                                )
                            }
                        )
                }
            </ul>

            {pagination && <div className="pagination">
                <a onClick={() => {
                    if (pageAtual > 1) {
                        setPageAtual(pageAtual - 1);
                    }
                }} className={
                    pageAtual === 1 ? "pagination-button-disabled" : "pagination-button"
                } id="previous"
                ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g clipPath="url(#clip0_206_145)">
                            <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" fill="black" />
                        </g>
                        <defs>
                            <clipPath id="clip0_206_145">
                                <rect width="24" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg></a>
                {pageAtual > 1 && <a className="pagination-button" onClick={() => {
                    if (pageAtual > 1) {
                        setPageAtual(pageAtual - 1);
                    }
                }}>{pageAtual - 1}</a>
                }
                <a className="pagination-button-active">{pageAtual}</a>
                {pageAtual < Math.ceil(transacoes.length / limit) && <a className="pagination-button" onClick={() => { setPageAtual(pageAtual + 1); }}>{pageAtual + 1}</a>}
                {pageAtual + 1 < Math.ceil(transacoes.length / limit) && <a className="pagination-button" onClick={() => { setPageAtual(pageAtual + 2); }}>{pageAtual + 2}</a>}
                <a className="pagination-button">...</a>
                {pageAtual < Math.ceil(transacoes.length / limit) && <a className="pagination-button" onClick={() => { setPageAtual(Math.ceil(transacoes.length / limit)); }}>{Math.ceil(transacoes.length / limit)}</a>}
                <a className="pagination-button" onClick={() => {
                    if (pageAtual < Math.ceil(transacoes.length / limit)) {
                        setPageAtual(pageAtual + 1);
                    }
                }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g clipPath="url(#clip0_206_57)">
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