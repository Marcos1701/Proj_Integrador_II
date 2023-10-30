import './App.css'
import { ProtectedRoute } from './Components/ProtectedRoute'
import { Home } from './Components/Home';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { TransacoesPage } from './Components/TransacoesPage';
import { TransacoesProvider } from './providers/TransacoesProvider';
import { CategoriasProvider } from './providers/CategoriasProvider';
import { MetasProvider } from './providers/MetasProvider';
import { useAuth } from './Contexts/AuthContext';
import { RegisterPage } from './Components/Auth/RegisterPage';
import { LoginPage } from './Components/Auth/LoginPage';


// as rotas não estão funcionando, pois não estão sendo renderizadas
// o erro está no arquivo App.tsx
// para corrigir, compare o arquivo App.tsx com o arquivo main.tsx
// o arquivo main.tsx está correto, pois está renderizando o componente App
// 
function App() {

  const { user, signout } = useAuth()

  return (

    <BrowserRouter>
      <TransacoesProvider>
        <CategoriasProvider>
          <MetasProvider>
            <header>
              {user ? (
                <p>Olá, {user.nome}</p>
              ) : (
                <p>Olá, visitante</p>
              )}
              <nav>
                <ul>
                  {user ? (
                    <>
                      <li>
                        <NavLink to="/">Home</NavLink>
                      </li>
                      {/* <li>
                    <Link href="/perfil">Perfil</Link>
                  </li> */}
                      <li>
                        <NavLink to={"/Transacoes"}>Transações</NavLink>
                      </li>
                      <li>
                        <button onClick={signout}>Sair</button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <NavLink to="/login">Login</NavLink>
                      </li>
                      <li>
                        <NavLink to="/register">Cadastro</NavLink>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            </header>


            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/Transacoes" element={
                <ProtectedRoute>
                  <TransacoesPage />
                </ProtectedRoute>
              } />

            </Routes>

            <footer>
              <a href="https://github.com/Marcos1701/Projeto_integrador_II">Projeto Integrador II - 2023</a>
              <p>&#169; Todos os direitos reservados</p>
            </footer>
          </MetasProvider>
        </CategoriasProvider>
      </TransacoesProvider>
    </BrowserRouter >

  )
}

export default App
