import { ListCategorias } from "../List/ListCategorias";
import { SecaoActions_Home } from "./Components/SecaoAcoes";
import './Home.css'
import { ListTransacoes } from "../List/ListTransacoes";
import { ListaMetas } from "../List/ListMetasV2";

export function Home() {

  return (
    <main className="Home">
      <SecaoActions_Home />
      <section className="trasacoes-home">
        <ListTransacoes />
      </section>

      <section className="categorias-home">
        <ListCategorias pagination={false} />
      </section>

      <section className="metas-home">
        <ListaMetas />
      </section>
    </main>
  )
}