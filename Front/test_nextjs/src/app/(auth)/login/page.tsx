import { FormLogin } from "@/Components/Auth/FormLogin";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'Login',
    description: 'Pagina de Login',
}

export default function Login() {
    return (
        <main>
            <h1 className='title-login'>Login</h1>
            <h2 className='subtitle-login'>Faça seu login</h2>

            <FormLogin />
            <Link href="/cadastro">Criar Conta </Link>
        </main>
    )
}