import { ListTransacoes } from "./Components/ListTransacoes";
import { ListCategorias } from "./Components/ListCategorias";
import { ListMetas } from "./Components/ListMetas";

export async function Main() {
    return (
        <main>

            <ListTransacoes />
            <ListCategorias />
            <ListMetas />
        </main>
    )
}