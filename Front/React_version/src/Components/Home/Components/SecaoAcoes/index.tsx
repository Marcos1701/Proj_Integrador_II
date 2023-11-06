import { Saldo } from "./Components/Saldo";
import { Button } from '../../../Button';
import { AdicionarTransacaoForm } from "../AdicionarTransacaoForm";
import { AdicionarCategoriaForm } from "../AdicionarCategoriaForm/intex";
import { useState } from "react";
import { ICategoria } from "../../../Categoria";
import { useAuth } from "../../../../Contexts/AuthContext";
import './Secao.css'
import { useContext } from 'react';
import { CategoriasContext } from "../../../../Contexts/CategoriasContext";


export function SecaoActions_Home() {

    const [showAdicionarTransacaoForm, setShowAdicionarTransacaoForm] = useState<boolean>(false);
    const [showAdicionarCategoriaForm, setShowAdicionarCategoriaForm] = useState<boolean>(false);

    return (
        <div className="Secao_acoes">
            <Saldo />

            <div className="buttons_Action_div">
                <ul className="buttons_Action">
                    <li key="adicionarTransacao">
                        <button onClick={() => setShowAdicionarTransacaoForm(!showAdicionarTransacaoForm)}>Adicionar Transação</button>
                    </li>

                    <li key="adicionarCategoria">
                        <button onClick={() => setShowAdicionarCategoriaForm(!showAdicionarCategoriaForm)}>Adicionar Categoria</button>
                    </li>

                    <li key="adicionarMeta">
                        <Button text="Adicionar Meta" onClick={() => { }} /> {/* Ainda não implementado */}
                    </li>
                </ul>
            </div>
            {showAdicionarTransacaoForm &&
                <div className="Background-form">
                    <AdicionarTransacaoForm setExibirAdicionarTransacaoForm={setShowAdicionarTransacaoForm} />
                </div>
            }

            {showAdicionarCategoriaForm &&
                <div className="Background-form">
                    <AdicionarCategoriaForm setExibirAdicionarCategoriaForm={setShowAdicionarCategoriaForm} />
                </div>
            }
        </div>
    )
}