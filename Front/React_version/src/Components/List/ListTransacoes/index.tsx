import { CategoriasContext } from "../../../Contexts/CategoriasContext";
import { TransacoesContext, TransacoesContextData } from "../../../Contexts/TransacoesContext";
import { ICategoria } from "../ListCategorias/Components/Categoria";
import { ITransacao } from "../ListTransacoesCard/Components/Transacao";
import { useContext, useState } from "react";
import './ListTransacoes.css'
import { Box } from "./Components/Box/box";
import { Link } from "react-router-dom";
import { Orderdiv } from "./Components/Orderdiv";
import { Searchdiv } from "./Components/Searchdiv";
import { MagicMotion } from "react-magic-motion";


interface IListTransacoesProps {
    pagination?: boolean
    orderSelect?: boolean
    searchInput?: boolean
    limit?: number
    page?: number
    classname?: string
    setShowDetails?: React.Dispatch<React.SetStateAction<boolean>>
    setTransacao?: React.Dispatch<React.SetStateAction<ITransacao | undefined>>
}

export function ListTransacoes(
    {
        classname = "ListTransacoesSimple",
        pagination = true,
        orderSelect = true,
        searchInput = true,
        limit = 3,
        page = 1,
        setShowDetails,
        setTransacao
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

            {classname !== "list_on_page" &&
                <div className="anchors_to_transacoesPage">
                    <h2 className="title">Últimas transações</h2>
                    <Link to={`/transacoes`} key={"linkToTransacoes"}>Ver todas</Link>
                </div>
            }

            <div className="legend-transacoes">
                <div className="legend-item">Titulo</div>
                <div className="legend-item">Categoria</div>
                <div className="legend-item">Data</div>
                <div className="legend-item">Valor</div>
            </div>
            <MagicMotion>
                <ul className="listValues" id={classname === "list_on_page" ? "listTransacoes" : "listTransacoesSimple"}>
                    {transacoes.length === 0 && <li className="empty" key={"empty"}>Nenhuma transação cadastrada</li>}
                    {
                        transacoes
                            .slice(pageAtual * limit - limit, pageAtual * limit)
                            .map(
                                (transacao: ITransacao) => {
                                    const categoria: ICategoria | undefined = categorias.find(
                                        (categoria: ICategoria) => {
                                            return categoria.id === transacao.categoriaid
                                        }
                                    );

                                    if (!categoria) {
                                        return <li key={transacao.id + 'noCategory'}></li>
                                    }

                                    return (
                                        <li className="listItem" key={transacao.id}>
                                            <Box
                                                key={transacao.id + "box"}
                                                transacao={transacao}
                                                categoria={categoria}
                                                setShowDetails={setShowDetails}
                                                setTransacao={setTransacao}
                                            />
                                        </li>
                                    )
                                }
                            )
                    }
                </ul>
            </MagicMotion>

            {
                pagination && <div className="pagination">
                    <a className={
                        pageAtual === 1 ? "pagination-button-disabled" : "pagination-button"} onClick={() => {
                            if (pageAtual > 1) {
                                setPageAtual(pageAtual - 1);
                            }
                        }}
                        id="previous"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <g clipPath="url(#clip0_206_145)">
                                <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" fill="black" />
                            </g>
                            <defs>
                                <clipPath id="clip0_206_145">
                                    <rect width="24" height="24" fill="white" />
                                </clipPath>
                            </defs>
                        </svg></a>
                    <a className="pagination-button-active">{pageAtual}</a>
                    {pageAtual < Math.ceil(transacoes.length / limit) && <a className="pagination-button" onClick={() => setPageAtual(pageAtual + 1)}>{pageAtual + 1}</a>}
                    {pageAtual + 1 < Math.ceil(transacoes.length / limit) && <a className="pagination-button" onClick={() => setPageAtual(pageAtual + 2)}>{pageAtual + 2}</a>}
                    <a className="pagination-button">...</a>
                    {pageAtual < Math.ceil(transacoes.length / limit) && <a className="pagination-button" onClick={() => setPageAtual(Math.ceil(transacoes.length / limit))}>{Math.ceil(transacoes.length / limit)}</a>}
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