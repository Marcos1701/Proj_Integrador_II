import { Saldo } from "./Components/Saldo";
import { Button } from '../../../Button';
import { AdicionarTransacaoForm } from "../AdicionarTransacaoForm";
import { AdicionarCategoriaForm } from "../AdicionarCategoriaForm/intex";
import { useUser } from "../../../EncapsulatedContext";
import { useEffect, useState } from "react";
import { ICategoria } from "../../../Categoria";
import { User } from "../../../../Contexts/AuthContext";


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
                <Button text="Adicionar Transação" onClick={() => {
                    return (
                        <div className="Background-form">
                            <AdicionarTransacaoForm categorias={categorias} />
                        </div>
                    )
                }} />

                <Button text="Adicionar Categoria" onClick={() => {
                    return (
                        <div className="Background-form">
                            <AdicionarCategoriaForm />
                        </div>
                    )
                }} />

                <Button text="Adicionar Meta" onClick={() => { }} /> {/* Ainda não implementado */}
            </ul>
        </div>
    )
}