import { AdicionarMetaForm } from '../../Form/AdicionarMetaForm'
import '../AddItemPage.css'

export function AddMetaPage() {

    return (
        <main className="AddPage">
            <div className="AddPage__content">
                <h1>Adicionar Meta</h1>
                <AdicionarMetaForm />
            </div>
        </main>
    )
}