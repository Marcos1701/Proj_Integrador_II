import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation';

export default function Dashboard() {

  // verificar se o usuário está logado
  // se estiver logado, mostrar o conteúdo
  // se não estiver logado, redirecionar para a página de login

  const { data: session } = useSession();
  if (!session) {
    return redirect('/login');
  }

  return (
    <main>
      <h1>Home</h1>
    </main>
  )
}

Dashboard.auth = true;
// agora, o nextjs sabe que essa página precisa de autenticação