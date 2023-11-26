import { SecaoActions_Home } from "./Components/SecaoAcoes";
import './Home.css'
import { ListTransacoes } from "../List/ListTransacoes";
import { useState } from "react";
import { ICategoria } from "../List/ListCategorias/Components/Categoria";
import { ITransacao } from "../List/ListTransacoesCard/Components/Transacao";
import { DetailsTransacaoPage } from "../Pages/DetailsPage/Transacao";

export function Home() {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [categoria, setCategoria] = useState<ICategoria>();
  const [transacao, setTransacao] = useState<ITransacao | undefined>();
  const [meta, setMeta] = useState<IMeta | undefined>();

  return (
    <main className="Home">

      {showDetails && transacao !== undefined && <DetailsTransacaoPage transacao={transacao} setShowDetails={setShowDetails} setTransacao={setTransacao} />}
      <section className="Principle">
        <SecaoActions_Home />
        <ListTransacoes pagination={false} setShowDetails={setShowDetails} setTransacao={setTransacao} searchInput={false} orderSelect={false} />
      </section>

      {showDetails && meta !== undefined && <DetailsMetaPage setShowDetails={setShowDetails} meta={meta} setMeta={setMeta} />}
      <section className="metas-home">
        <ListaMetas pagination={false} setShowDetails={setShowDetails} setMeta={setMeta} searchInput={false} orderSelect={false} />
        <SectionCategorias />
      </section>
    </main>
  )
}