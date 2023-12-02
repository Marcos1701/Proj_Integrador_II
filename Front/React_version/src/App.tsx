import './App.css'
import { BrowserRouter, NavLink } from 'react-router-dom';
import { TransacoesProvider } from './providers/TransacoesProvider';
import { CategoriasProvider } from './providers/CategoriasProvider';
import { MetasProvider } from './providers/MetasProvider';
import { PatchRoutes, AuthRoutes } from './Components/Routes';
import { useAuth } from './Contexts/AuthContext';
import { useState } from 'react';
import { DataProvider } from './providers/DataProvider';



function App() {

  const { user, signout } = useAuth()

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <BrowserRouter>

      <div className="App">
        {user &&
          <nav className={
            isMenuOpen ? "App-sidebar-active" : "App-sidebar"
          }>
            <div className='App-logo'>
              <img src="Icons/icone.png" alt="Logo" />
              <p>FinnApp</p>
            </div>
            <div className="App-sidebar-header">
              {!isMenuOpen ? (
                <div className="menu-div">
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="menu" aria-label="Main Menu">
                    <svg width="30" height="30" viewBox="0 0 100 100">
                      <path className="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                      <path className="line line2" d="M 20,50 H 80" />
                      <path className="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="menu-actived">
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="opened">
                    <svg width="30" height="30" viewBox="0 0 100 100">
                      <path className="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                      <path className="line line2" d="M 20,50 H 80" />
                      <path className="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <ul className="App-sidebar-menu">
              <li>
                <NavLink to={"/"}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 17.0002V11.4522C20 10.9179 19.9995 10.6506 19.9346 10.4019C19.877 10.1816 19.7825 9.97307 19.6546 9.78464C19.5102 9.57201 19.3096 9.39569 18.9074 9.04383L14.1074 4.84383C13.3608 4.19054 12.9875 3.86406 12.5674 3.73982C12.1972 3.63035 11.8026 3.63035 11.4324 3.73982C11.0126 3.86397 10.6398 4.19014 9.89436 4.84244L5.09277 9.04383C4.69064 9.39569 4.49004 9.57201 4.3457 9.78464C4.21779 9.97307 4.12255 10.1816 4.06497 10.4019C4 10.6506 4 10.9179 4 11.4522V17.0002C4 17.932 4 18.3978 4.15224 18.7654C4.35523 19.2554 4.74432 19.6452 5.23438 19.8482C5.60192 20.0005 6.06786 20.0005 6.99974 20.0005C7.93163 20.0005 8.39808 20.0005 8.76562 19.8482C9.25568 19.6452 9.64467 19.2555 9.84766 18.7654C9.9999 18.3979 10 17.932 10 17.0001V16.0001C10 14.8955 10.8954 14.0001 12 14.0001C13.1046 14.0001 14 14.8955 14 16.0001V17.0001C14 17.932 14 18.3979 14.1522 18.7654C14.3552 19.2555 14.7443 19.6452 15.2344 19.8482C15.6019 20.0005 16.0679 20.0005 16.9997 20.0005C17.9316 20.0005 18.3981 20.0005 18.7656 19.8482C19.2557 19.6452 19.6447 19.2554 19.8477 18.7654C19.9999 18.3978 20 17.932 20 17.0002Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to={"/categorias"}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 8.52V3.98C22 2.57 21.36 2 19.77 2H15.73C14.14 2 13.5 2.57 13.5 3.98V8.51C13.5 9.93 14.14 10.49 15.73 10.49H19.77C21.36 10.5 22 9.93 22 8.52Z" stroke="white" />
                    <path d="M22 19.77V15.73C22 14.14 21.36 13.5 19.77 13.5H15.73C14.14 13.5 13.5 14.14 13.5 15.73V19.77C13.5 21.36 14.14 22 15.73 22H19.77C21.36 22 22 21.36 22 19.77Z" stroke="white" />
                    <path d="M10.5 8.52V3.98C10.5 2.57 9.86 2 8.27 2H4.23C2.64 2 2 2.57 2 3.98V8.51C2 9.93 2.64 10.49 4.23 10.49H8.27C9.86 10.5 10.5 9.93 10.5 8.52Z" stroke="white" />
                    <path d="M10.5 19.77V15.73C10.5 14.14 9.86 13.5 8.27 13.5H4.23C2.64 13.5 2 14.14 2 15.73V19.77C2 21.36 2.64 22 4.23 22H8.27C9.86 22 10.5 21.36 10.5 19.77Z" stroke="white" />
                  </svg>
                  Categorias
                </NavLink>
              </li>
              <li>
                <NavLink to={"/transacoes"}>
                  <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="30" height="30" transform="translate(0.299744 0.463165)" />
                    <path d="M11.4908 9.74953H23.8701" stroke="#C7C7C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11.4908 15.463H23.8701" stroke="#C7C7C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11.4908 21.1765H23.8701" stroke="#C7C7C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.7298 9.74965H6.73836" stroke="#C7C7C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.72955 15.463H6.73812" stroke="#C7C7C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.72955 21.1765H6.73812" stroke="#C7C7C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                  Transações
                </NavLink>
              </li>
              <li>
                <NavLink to={"/metas"}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8.00001V4.50067C16 3.66893 16 3.25306 15.8248 2.99748C15.6717 2.77419 15.4346 2.62251 15.1678 2.57709C14.8623 2.52511 14.4847 2.69938 13.7295 3.04793L4.85901 7.142C4.18551 7.45285 3.84875 7.60828 3.60211 7.84933C3.38406 8.06243 3.21762 8.32256 3.1155 8.60984C3 8.9348 3 9.30569 3 10.0475V15M16.5 14.5H16.51M3 11.2L3 17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V11.2C21 10.0799 21 9.51985 20.782 9.09203C20.5903 8.71571 20.2843 8.40975 19.908 8.218C19.4802 8.00001 18.9201 8.00001 17.8 8.00001L6.2 8.00001C5.0799 8.00001 4.51984 8.00001 4.09202 8.218C3.7157 8.40974 3.40973 8.71571 3.21799 9.09203C3 9.51985 3 10.0799 3 11.2ZM17 14.5C17 14.7762 16.7761 15 16.5 15C16.2239 15 16 14.7762 16 14.5C16 14.2239 16.2239 14 16.5 14C16.7761 14 17 14.2239 17 14.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                  Metas
                </NavLink>
              </li>
              <svg width="261" height="1" viewBox="0 0 261 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0.978882" y1="0.5" x2="260.65" y2="0.5" stroke="#4B4B99" />
              </svg>

            </ul>

            <div className="App-sidebar-footer">
              {user && <button type="button" className="sidebar-footer-button" onClick={() => setShowOptions(!showOptions)}>
                <img src='Icons/perfil.svg' alt="Perfil" />
                {user.nome}
                {showOptions ?
                  //inverte
                  <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 8L6.5 1.5L0 8" stroke="white" />
                  </svg>
                  :
                  <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L7.5 7.5L13 1" stroke="white" />
                  </svg>
                }
              </button>}
              <ul className={"options_perfil" + (showOptions ? "-active" : "")}>
                <li key="perfil">
                  <button type="button" onClick={() => setShowOptions(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 20C5.33579 17.5226 8.50702 16 12 16C15.493 16 18.6642 17.5226 21 20M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Perfil</button>
                </li>
                <li key="logout">
                  <button className='logout-button' type="button" onClick={() => {
                    signout()
                  }}>Sair</button>
                </li>
              </ul>
            </div>
          </nav>
        }
        <div className="App-content">
          {user ?
            <TransacoesProvider>
              <CategoriasProvider>
                <MetasProvider>
                  <DataProvider>
                    <PatchRoutes />
                  </DataProvider>
                </MetasProvider>
              </CategoriasProvider>
            </TransacoesProvider>
            :
            <AuthRoutes />
          }
        </div>
      </div>
      {/* <Footer /> */}
    </BrowserRouter >

  )
}

export default App
