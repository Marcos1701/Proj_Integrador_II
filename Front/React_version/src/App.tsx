import './App.css'
import { BrowserRouter } from 'react-router-dom';
import { TransacoesProvider } from './providers/TransacoesProvider';
import { CategoriasProvider } from './providers/CategoriasProvider';
import { MetasProvider } from './providers/MetasProvider';
import { Header } from './Components/Header';
import { Footer } from './Components/Footer';
import { PatchRoutes } from './Components/Routes';


function App() {
  return (

    <BrowserRouter>
      <TransacoesProvider>
        <CategoriasProvider>
          <MetasProvider>

            <Header />

            <PatchRoutes />

            <Footer />
          </MetasProvider>
        </CategoriasProvider>
      </TransacoesProvider>
    </BrowserRouter >

  )
}

export default App
