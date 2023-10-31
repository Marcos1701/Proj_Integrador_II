import { Saldo } from "./Components/Saldo";
import { Button } from '../../../Button';
import { AdicionarTransacaoForm } from "../AdicionarTransacaoForm";
import { AdicionarCategoriaForm } from "../AdicionarCategoriaForm/intex";
import { useUser } from "@/EncapsulatedContext";


export async function SecaoActions_Home() {

    const user = await useUser()
    const categorias = await fetch(`http://localhost:3300/Categoria?id_usuario=${user.id}`).then(res => res.json()).catch(err => {
        console.log(err)
        return []
    });

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