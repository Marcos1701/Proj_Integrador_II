import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Home() {

  // verificar se o usuário está logado
  // se estiver logado, mostrar o conteúdo
  // se não estiver logado, redirecionar para a página de login

  const { data: session } = useSession()
  return (
    
  )
}
