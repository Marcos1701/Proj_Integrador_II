import { AdicionarTransacaoForm } from "../../Form/AdicionarTransacaoForm";
import '../AddItemPage.css'

export function AddTransacaoPage() {

    return (
        <main className="Page">
            <div className="Page__content">
                <h1>Adicionar Transação</h1>
                <AdicionarTransacaoForm />
            </div>
        </main>
    )
}