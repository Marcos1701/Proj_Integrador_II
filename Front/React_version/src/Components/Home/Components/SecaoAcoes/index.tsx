import { Saldo } from "./Components/Saldo";
import { Button } from '../../../Button';
import { AdicionarTransacaoForm } from "../AdicionarTransacaoForm";
import { AdicionarCategoriaForm } from "../AdicionarCategoriaForm/intex";
import { useEffect, useState } from "react";
import { ICategoria } from "../../../Categoria";
import { api_url, useAuth } from "../../../../Contexts/AuthContext";
import './Secao.css'


export function SecaoActions_Home() {

    const { user } = useAuth();
    const [categorias, setCategorias] = useState<ICategoria[]>([]);

    useEffect(() => {
        async function getCategorias() {
            if (!user) return;
            const categorias = await fetch(`${api_url}Categoria?id_usuario=${user.id}`).then(res => res.json()).catch(err => {
                console.log(err)
                return []
            });
            setCategorias(categorias);
        }
        getCategorias();
    }, []);

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
                    <AdicionarTransacaoForm categorias={categorias} />
                </div>
            }

            {showAdicionarCategoriaForm &&
                <div className="Background-form">
                    <AdicionarCategoriaForm />
                </div>
            }
        </div>
    )
}