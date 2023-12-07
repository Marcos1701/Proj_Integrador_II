import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ListCategorias } from "../../List/ListCategorias";
import { ICategoria } from "../../List/ListCategorias/Components/Categoria";
import { DetailCategoriaPage } from "../DetailsPage/Categoria/v2";


export function CategoriasPage() {

    const [voltar, setVoltar] = useState<boolean>(false);
    const [showDetails, setShowDetails] = useState<boolean>(false);
    const [categoria, setCategoria] = useState<ICategoria>();
    const [showAddItem, setShowAddItem] = useState<boolean>(false);

    return (
        <main className="page">
            {voltar && <Navigate to={'/'} />}
            {showDetails && categoria && <DetailCategoriaPage categoria={categoria} setShowDetails={setShowDetails} />}
            <div className="page-header">
                <button onClick={() => { setVoltar(!voltar) }}
                    className="back-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none">
                        <g clipPath="url(#clip0_206_145)">
                            <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" fill="#FFFFFF" />
                        </g>
                        <defs>
                            <clipPath id="clip0_206_145">
                                <rect width="24" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>

                <h2 className="title">Categorias disponíveis</h2>

                <div className="AddItem">
                    <button className="AddItem-Button" onClick={() => setShowAddItem(!showAddItem)}>
                        <img src="assets/ActionsIcons/plus.svg" alt="Adicionar Item" />
                    </button>
                    <div className={
                        showAddItem ? "opcoes_adicionar-active" : "opcoes_adicionar"
                    } onMouseLeave={() => setShowAddItem(false)}>
                        <Link to="/categorias/add">
                            Adicionar Categoria
                        </Link>
                    </div>
                </div>
            </div>
            <ListCategorias page={1} limit={8} classname="list_on_page" orderSelect={true} searchInput={true} setShowDetails={setShowDetails} setCategoria={setCategoria} />
        </main>
    )
}