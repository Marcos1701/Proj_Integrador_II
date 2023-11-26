import { Saldo } from "./Components/Saldo";
import { AdicionarTransacaoForm } from "../Form/AdicionarTransacaoForm";
import { AdicionarCategoriaForm } from "../Form/AdicionarCategoriaForm/intex";
import { useContext, useState } from "react";
import './Secao.css'
import { CategoriasContext } from "../../../../Contexts/CategoriasContext";
import { AdicionarMetaForm } from "../Form/AdicionarMetaForm";
import { MagicMotion } from "react-magic-motion";
import { Gastos } from "./Components/Gastos";


export function SecaoActions_Home() {

    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [showAdicionarTransacaoForm, setShowAdicionarTransacaoForm] = useState<boolean>(false);
    const [showAdicionarCategoriaForm, setShowAdicionarCategoriaForm] = useState<boolean>(false);
    const [showAdicionarMetaForm, setShowAdicionarMetaForm] = useState<boolean>(false);

    const categorias = useContext(CategoriasContext)
    return (
        <div className="div_Values">
                <Saldo />
                <Gastos />

            {/* <div className="buttons_Action_div">
                <button type="button" className="button_Action" onClick={() => setShowOptions(!showOptions)} title="Adicionar">
                    <img src="assets/ActionsIcons/plus.svg" alt="Adicionar" />
                </button>
                <MagicMotion transition={
                    {
                        duration: 0.5,
                        ease: "easeInOut",
                        delay: 0.2,
                        type: "spring",
                    }
                }>
                    <ul className={"options_Action" + (showOptions ? "-active" : "")}>
                        <li key="adicionarTransacao">
                            <button type="button" {...categorias.length === 0 && { title: "Adicione uma categoria", disabled: true }} onClick={() => setShowAdicionarTransacaoForm(!showAdicionarTransacaoForm)}>Adicionar Transação</button>
                        </li>

                        <li key="adicionarCategoria">
                            <button type="button" onClick={() => setShowAdicionarCategoriaForm(!showAdicionarCategoriaForm)}>Adicionar Categoria</button>
                        </li>

                        <li key="adicionarMeta">
                            <button type="button" onClick={() => setShowAdicionarMetaForm(true)}>Adicionar Meta</button>
                        </li>
                    </ul>
                </MagicMotion>
            </div>
            {showAdicionarTransacaoForm &&
                <div className="Background-blur" id="background-form">
                    <AdicionarTransacaoForm setExibirAdicionarTransacaoForm={setShowAdicionarTransacaoForm} />
                </div>
            }

            {showAdicionarCategoriaForm &&
                <div className="Background-blur" id="background-form">
                    <AdicionarCategoriaForm setExibirAdicionarCategoriaForm={setShowAdicionarCategoriaForm} />
                </div>
            }

            {showAdicionarMetaForm &&
                <div className="Background-blur" id="background-form">
                    <AdicionarMetaForm setExibirAdicionarMetaForm={setShowAdicionarMetaForm} />
                </div>
            }*/}
        </div>
    )
}