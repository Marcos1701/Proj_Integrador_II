import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import NextAuthSessionProvider from '@/providers/sessionProvider';
import { useUser } from '@/EncapsulatedContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: "Home", template: "%s | FinApp" },
  description: 'Pagina Inicial',
  authors: [{
    name: 'Marcos Neiva',
    url: 'https://github.com/Marcos1701'
  },
  {
    name: 'Gabriel Morais',
    url: "https://github.com/MrMorgam"
  },
  {
    name: "Erick",
    url: "https://github.com/erick7amorim"
  }
  ]
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  const user = await useUser();


  return (
    <html lang="pt-br">

      <NextAuthSessionProvider>
        <header>
          {user ? (
            <p>Olá, {user.name}</p>
          ) : (
            <p>Olá, visitante</p>
          )}
          <nav>
            <ul>
              {user ? (
                <>
                  <li>
                    <Link href="/Home">Home</Link>
                  </li>
                  {/* <li>
                    <Link href="/perfil">Perfil</Link>
                  </li> */}
                  <li>
                    <button >Sair</button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/login">Login</Link>
                  </li>
                  <li>
                    <Link href="/cadastro">Cadastro</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>
        <body className={inter.className}>{children}</body>
        <footer>
          <Link href="https://github.com/Marcos1701/Projeto_integrador_II">Projeto Integrador II - 2023</Link>
          <p>&#169; Todos os direitos reservados</p>
        </footer>
      </NextAuthSessionProvider>
    </html>
  )
}
