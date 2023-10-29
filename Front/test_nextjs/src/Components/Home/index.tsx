import { ListTransacoes } from "../ListTransacoes";
import { ListCategorias } from "../ListCategorias";
import { ListMetas } from "../ListMetas";
import { SecaoActions_Home } from "./Components/SecaoAcoes";

export async function Main() {
    return (
        <main>
            <SecaoActions_Home />
            <ListTransacoes />
            <ListCategorias />
            <ListMetas />
        </main>
    )
}