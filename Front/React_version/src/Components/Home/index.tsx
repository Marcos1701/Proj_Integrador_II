import { ListCategorias } from "../List/ListCategorias";
import { SecaoActions_Home } from "./Components/SecaoAcoes";
import './Home.css'
import { ListTransacoes } from "../List/ListTransacoes";
import { ListaMetas } from "../List/ListMetasV2";
import { useState } from "react";
import { ICategoria } from "../List/ListCategorias/Components/Categoria";
import { DetailCategoriaPage } from "../Pages/DetailsPage/Categoria/v2";
import { ITransacao } from "../List/ListTransacoesCard/Components/Transacao";
import { DetailsTransacaoPage } from "../Pages/DetailsPage/Transacao";

export function Home() {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [categoria, setCategoria] = useState<ICategoria>();
  const [transacao, setTransacao] = useState<ITransacao | undefined>();

  return (
    <main className="Home">
      <SecaoActions_Home />

      {showDetails && transacao !== undefined && <DetailsTransacaoPage transacao={transacao} setShowDetails={setShowDetails} setTransacao={setTransacao} />}
      <section className="trasacoes-home">
        <ListTransacoes pagination={false} setShowDetails={setShowDetails} setTransacao={setTransacao} searchInput={false} orderSelect={false} />
      </section>

      {showDetails && categoria !== undefined && <DetailCategoriaPage categoria={categoria} setShowDetails={setShowDetails} setCategoria={setCategoria} />}
      <section className="categorias-home">
        <ListCategorias pagination={false} setShowDetails={setShowDetails} setCategoria={setCategoria} />
      </section>

      <section className="metas-home">
        <ListaMetas />
      </section>
    </main>
  )
}