import { AdicionarMetaForm } from '../../Form/AdicionarMetaForm'
import '../AddItemPage.css'

export function AddMetaPage() {

    return (
        <main className="Page">
            <div className="Page__content">
                <h1>Adicionar Meta</h1>
                <AdicionarMetaForm />
            </div>
        </main>
    )
}