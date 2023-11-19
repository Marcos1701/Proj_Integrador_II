import { Saldo } from "./Components/Saldo";
import { AdicionarTransacaoForm } from "../Form/AdicionarTransacaoForm";
import { AdicionarCategoriaForm } from "../Form/AdicionarCategoriaForm/intex";
import { useContext, useState } from "react";
import './Secao.css'
import { CategoriasContext } from "../../../../Contexts/CategoriasContext";


export function SecaoActions_Home() {

    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [showAdicionarTransacaoForm, setShowAdicionarTransacaoForm] = useState<boolean>(false);
    const [showAdicionarCategoriaForm, setShowAdicionarCategoriaForm] = useState<boolean>(false);

    const categorias = useContext(CategoriasContext)
    return (
        <div className="Secao_acoes">
            <Saldo />

            <div className="buttons_Action_div">
                <button type="button" className="button_Action" onClick={() => setShowOptions(!showOptions)} title="Adicionar">
                    <img src="assets/ActionsIcons/plus.svg" alt="Adicionar" />
                </button>
                <ul className={"options_Action" + (showOptions ? "-active" : "")}>
                    <li key="adicionarTransacao">
                        <button type="button" {...categorias.length === 0 && { title: "Adicione uma categoria", disabled: true }} onClick={() => setShowAdicionarTransacaoForm(!showAdicionarTransacaoForm)}>Adicionar Transação</button>
                    </li>

                    <li key="adicionarCategoria">
                        <button type="button" onClick={() => setShowAdicionarCategoriaForm(!showAdicionarCategoriaForm)}>Adicionar Categoria</button>
                    </li>

                    <li key="adicionarMeta">
                        <button type="button" onClick={() => { }}>Adicionar Meta</button>
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