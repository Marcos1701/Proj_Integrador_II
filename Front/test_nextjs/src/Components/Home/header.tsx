import { User, useUser } from '@/utils';
import { useSession } from 'next-auth/react'
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Header() {

    // verificar se o usuário está logado
    // se estiver logado, mostrar o conteúdo
    // se não estiver logado, redirecionar para a página de login

    // const { data: session } = useSession();
    // if (!session) {
    //     return redirect('/login');
    // }

    const user: User = await useUser();

    if (!user) {
        return redirect('/login');
    }

    return (
        <header>
            <p>Olá, ${user.name}</p>
            <div className="opcoes-home">
                <Link href='perfil'>Perfil</Link>
                <Link href="Configurações">Configurações</Link>
                <Link href="Sair">Sair</Link>
            </div>
        </header>
    )
}

// Header.auth = true;
// agora, o nextjs sabe que essa página precisa de autenticação