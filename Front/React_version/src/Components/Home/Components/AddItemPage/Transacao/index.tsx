import { AdicionarTransacaoForm } from "../../Form/AdicionarTransacaoForm";
import '../AddItemPage.css'

export function AddTransacaoPage() {

    return (
        <main className="AddPage">
            <div className="AddPage__content">
                <h1>Adicionar Transação</h1>
                <AdicionarTransacaoForm />
            </div>
        </main>
    )
}