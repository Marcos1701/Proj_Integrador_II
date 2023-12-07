import { SecaoActions_Home } from "./Components/SecaoAcoes";
import './Home.css'
import { ListTransacoes } from "../List/ListTransacoes";
import { useState } from "react";
import { ITransacao } from "../List/ListTransacoesCard/Components/Transacao";
import { DetailsTransacaoPage } from "../Pages/DetailsPage/Transacao";
import { ListaMetas } from "../List/ListMetasV2";
import { SectionCategorias } from "./Components/SectionCategorias";
import { GraphTransactionHistory } from "./Components/GraphHistory/Transaction";
import { useAuth } from "../../Contexts/AuthContext";
import { Link } from "react-router-dom";
import { IMeta } from "../List/ListMetasV2/Components/Meta";
import { DetailsMetaPage } from "../Pages/DetailsPage/Meta";

export function Home() {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showAddItem, setShowAddItem] = useState<boolean>(false);
  // const [categoria, setCategoria] = useState<ICategoria>();
  const [transacao, setTransacao] = useState<ITransacao | undefined>();
  const [meta, setMeta] = useState<IMeta | undefined>();

  const { user } = useAuth()
  if (!user) return <></>

  return (
    <main className="Home">

      {showDetails && transacao !== undefined && <DetailsTransacaoPage transacao={transacao} setShowDetails={setShowDetails} setTransacao={setTransacao} />}
      {showDetails && meta !== undefined && <DetailsMetaPage meta={meta} setShowDetails={setShowDetails} setMeta={setMeta} />}

      <section className="Principle">
        <div className="Home-header">
          <div className="Header-info">
            <h1>Olá, {user.nome}</h1>
            <p>Veja os seus gastos e metas</p>
          </div>
          <div className="AddItem">
            <button className="AddItem-Button" onClick={() => setShowAddItem(!showAddItem)}>
              <img src="assets/ActionsIcons/plus.svg" alt="Adicionar Item" />
            </button>
            <div className={
              showAddItem ? "opcoes_adicionar-active" : "opcoes_adicionar"
            } onMouseLeave={() => setShowAddItem(false)}>
              <Link to="/transacoes/add">
                Adicionar Transação
              </Link>
              <Link to="/categorias/add">
                Adicionar Categoria
              </Link>
              <Link to="/metas/add">
                Adicionar Meta
              </Link>
            </div>
          </div>
        </div>
        <SecaoActions_Home />
        <GraphTransactionHistory />
        <ListTransacoes pagination={false} setShowDetails={setShowDetails} setTransacao={setTransacao} searchInput={false} orderSelect={false} />
      </section>

      <section className="Metas-CategoriasSection">
        <ListaMetas pagination={false} searchInput={false} orderSelect={false} setShowDetails={setShowDetails} setMeta={setMeta} />
        <SectionCategorias />
      </section>
    </main >
  )
}