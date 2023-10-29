import { Main } from '@/Components/Home';
import { ProtectedRoute } from '@/Components/ProtectedRoute';

export default function Dashboard() {

  // verificar se o usuário está logado
  // se estiver logado, mostrar o conteúdo
  // se não estiver logado, redirecionar para a página de login

  // const { data: session } = useSession();
  // if (!session) {
  //   return redirect('/login');
  // }

  // const user: Session['user'] = session.user!;

  return (
    <ProtectedRoute>
      <Main />
    </ProtectedRoute>
  )
}

// Dashboard.auth = true;
// agora, o nextjs sabe que essa página precisa de autenticação