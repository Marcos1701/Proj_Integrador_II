import { useSession } from 'next-auth/react'
import { Session } from '@auth0/nextjs-auth0'
import { redirect } from 'next/navigation';

export default function Home() {

  // verificar se o usuário está logado
  // se estiver logado, mostrar o conteúdo
  // se não estiver logado, redirecionar para a página de login

  const { data: session } = useSession();
  const user = session?.user as Session['user'];
  return (
    <main>
      {!user && (
        redirect('/login')
      )}
      <h1>Home</h1>
      <p>Olá, {user?.name}</p>
    </main>
  )
}
