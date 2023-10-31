import { Saldo } from "./Components/Saldo";
import { Button } from '../../../Button';
import { AdicionarTransacaoForm } from "../AdicionarTransacaoForm";
import { AdicionarCategoriaForm } from "../AdicionarCategoriaForm/intex";
import { useUser } from "../../../EncapsulatedContext";
import { useEffect, useState } from "react";
import { ICategoria } from "../../../Categoria";
import { User } from "../../../../Contexts/AuthContext";
import './Secao.css'


export function SecaoActions_Home() {

    const [user, setUser] = useState<User>();
    const [categorias, setCategorias] = useState<ICategoria[]>([]);

    useEffect(() => {
        async function getUser() {
            const user = await useUser();
            setUser(user);
        }

        async function getCategorias() {
            if (!user) return;
            const categorias = await fetch(`http://localhost:3300/Categoria?id_usuario=${user.id}`).then(res => res.json()).catch(err => {
                console.log(err)
                return []
            });
            setCategorias(categorias);
        }
        getUser();
        getCategorias();
    }, []);

    const [showAdicionarTransacaoForm, setShowAdicionarTransacaoForm] = useState<boolean>(false);
    const [showAdicionarCategoriaForm, setShowAdicionarCategoriaForm] = useState<boolean>(false);


    return (
        <div>
            <Saldo />
            <ul className="buttons_Action">
                <li key="adicionarTransacao">
                    <Button text="Adicionar Transação" onClick={() => setShowAdicionarTransacaoForm(!showAdicionarTransacaoForm)} />
                </li>

                <li key="adicionarCategoria">
                    <Button text="Adicionar Categoria" onClick={() => setShowAdicionarCategoriaForm(!showAdicionarCategoriaForm)} />
                </li>

                <li key="adicionarMeta">
                    <Button text="Adicionar Meta" onClick={() => { }} /> {/* Ainda não implementado */}
                </li>
            </ul>
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