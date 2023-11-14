import { Saldo } from "./Components/Saldo";
import { AdicionarTransacaoForm } from "../Form/AdicionarTransacaoForm";
import { AdicionarCategoriaForm } from "../Form/AdicionarCategoriaForm/intex";
import { useContext, useState } from "react";
import './Secao.css'
import { CategoriasContext } from "../../../../Contexts/CategoriasContext";


export function SecaoActions_Home() {

    const [showAdicionarTransacaoForm, setShowAdicionarTransacaoForm] = useState<boolean>(false);
    const [showAdicionarCategoriaForm, setShowAdicionarCategoriaForm] = useState<boolean>(false);

    const categorias = useContext(CategoriasContext)
    return (
        <div className="Secao_acoes">
            <Saldo />

            <div className="buttons_Action_div">
                <ul className="buttons_Action">
                    <li key="adicionarTransacao">
                        <button {...categorias.length === 0 && { title: "Adicione uma categoria", disabled: true }} onClick={() => setShowAdicionarTransacaoForm(!showAdicionarTransacaoForm)}>Adicionar Transação</button>
                    </li>

                    <li key="adicionarCategoria">
                        <button onClick={() => setShowAdicionarCategoriaForm(!showAdicionarCategoriaForm)}>Adicionar Categoria</button>
                    </li>

                    <li key="adicionarMeta">
                        <button onClick={() => { }}>Adicionar Meta</button> {/* Ainda não implementado */}
                    </li>
                </ul>
            </div>
            {showAdicionarTransacaoForm &&
                <div className="Background-blur">
                    <AdicionarTransacaoForm setExibirAdicionarTransacaoForm={setShowAdicionarTransacaoForm} />
                </div>
            }

            {showAdicionarCategoriaForm &&
                <div className="Background-blur">
                    <AdicionarCategoriaForm setExibirAdicionarCategoriaForm={setShowAdicionarCategoriaForm} />
                </div>
            }
        </div>
    )
}