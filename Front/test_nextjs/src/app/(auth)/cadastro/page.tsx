import { FormCadastro } from "@/Components/Auth/FormCadastro";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'Cadastro',
    description: 'Pagina de Cadastro',
}

export default function Cadastro() {
    return (
        <main>
            <h1 className='title-Cadastro'>Cadastro</h1>
            <h2 className='subtitle-Cadastro'>Faça seu Cadastro</h2>

            <FormCadastro />
            <Link href="/login">Já tenho uma conta</Link>
        </main>
    )
}