import { ITransacao } from "@/Components/Transacao";
import { useAuth } from "@/Contexts/AuthContext";
import { Suspense } from "react";
import { Saldo } from "./Components/Saldo";
import { Button } from '../../../Button';
import { AdicionarTransacaoForm } from "../AdicionarTransacaoForm";
import { AdicionarCategoriaForm } from "../AdicionarCategoriaForm/intex";


export async function SecaoActions_Home() {

    const { user } = useAuth();

    return (
        <div>
            <Saldo />
            <ul className="buttons_Action">
                <Button placeholder="Adicionar Transação" onClick={() => {
                    return (
                        <div className="Background-form">
                            <AdicionarTransacaoForm />
                        </div>
                    )
                }} />

                <Button placeholder="Adicionar Categoria" onClick={() => {
                    return (
                        <div className="Background-form">
                            <AdicionarCategoriaForm />
                        </div>
                    )
                }} />

                <Button placeholder="Adicionar Meta" onClick={() => { }} /> {/* Ainda não implementado */}
            </ul>
        </div>
    )
}