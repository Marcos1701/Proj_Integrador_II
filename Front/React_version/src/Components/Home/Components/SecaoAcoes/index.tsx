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

    return (
        <div>
            <Saldo />
            <ul className="buttons_Action">
                <li key="adicionarTransacao">
                    <Button text="Adicionar Transação" onClick={() => {
                        return (
                            <div className="Background-form">
                                <AdicionarTransacaoForm categorias={categorias} />
                            </div>
                        )
                    }} />
                </li>

                <li key="adicionarCategoria">
                    <Button text="Adicionar Categoria" onClick={() => {
                        return (
                            <div className="Background-form">
                                <AdicionarCategoriaForm />
                            </div>
                        )
                    }} />
                </li>

                <li key="adicionarMeta">
                    <Button text="Adicionar Meta" onClick={() => { }} /> {/* Ainda não implementado */}
                </li>
            </ul>
        </div>
    )
}