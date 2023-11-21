import { Categoria, ICategoria } from "./Components/Categoria";
import { useContext, useState } from "react";
import { CategoriasContext } from "../../../Contexts/CategoriasContext";
import "./ListCategorias.css";
import { Searchdiv } from "./Components/Searchdiv";
import { Orderdiv } from "./Components/Orderdiv";
import { Link } from "react-router-dom";
import { MagicMotion } from "react-magic-motion";

interface ListCategoriasProps {
    pagination?: boolean
    orderSelect?: boolean
    searchInput?: boolean
    limit?: number
    page?: number
    classname?: string
    setShowDetails?: React.Dispatch<React.SetStateAction<boolean>>
    setCategoria?: React.Dispatch<React.SetStateAction<ICategoria | undefined>>
}

export function ListCategorias(
    {
        pagination = true,
        orderSelect = false,
        searchInput = false,
        limit = 3,
        page = 1,
        classname = "div_categorias",
        setShowDetails,
        setCategoria
    }: ListCategoriasProps
) {

    const [pageAtual, setPageAtual] = useState<number>(page);

    const categorias: ICategoria[] = useContext<ICategoria[]>(CategoriasContext);

    return (
        <>
            <div className={classname}>

                {(searchInput || orderSelect) && (
                    <div className="search-order">
                        {orderSelect && <Orderdiv />}
                        {searchInput && <Searchdiv />}
                    </div>
                )}

                {classname !== "list_on_page" &&
                    <div className="anchors_to_categoriasPage" id="title-list-categoria">
                        <h2 className="title">Categorias Disponíveis</h2>
                        <Link to={`/categorias`} key={"linkToCategorias"}>Ver todas</Link>
                    </div>
                }
                <div className="legend-categorias">
                    <div className="legend-item">Nome</div>
                    <div className="legend-item">Data de Criação</div>
                    <div className="legend-item">Gastos</div>
                    <div className="legend-item">Orçamento</div>
                </div>
                <MagicMotion>
                    <ul className="listValues" id="listCategorias">
                        {categorias.length === 0 && <li className="empty">Nenhuma categoria cadastrada</li>}
                        {
                            categorias.slice(pageAtual * limit - limit, pageAtual * limit)
                                .map(
                                    (categoria: ICategoria) => <li key={categoria.id} className="listItem"><Categoria categoria={categoria} key={categoria.id} setShowDetails={setShowDetails} setCategoria={setCategoria} /> </li>
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
                        {pageAtual < Math.ceil(categorias.length / limit) && <a className="pagination-button" onClick={() => setPageAtual(pageAtual + 1)}>{pageAtual + 1}</a>}
                        {pageAtual + 1 < Math.ceil(categorias.length / limit) && <a className="pagination-button" onClick={() => setPageAtual(pageAtual + 2)}>{pageAtual + 2}</a>}
                        <a className="pagination-button">...</a>
                        {pageAtual < Math.ceil(categorias.length / limit) && <a className="pagination-button" onClick={() => setPageAtual(Math.ceil(categorias.length / limit))}>{Math.ceil(categorias.length / limit)}</a>}
                        <a className="pagination-button" onClick={() => {
                            if (pageAtual < Math.ceil(categorias.length / limit)) {
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
        </>
    )
}