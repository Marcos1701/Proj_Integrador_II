
import { AdicionarCategoriaForm } from '../../Form/AdicionarCategoriaForm/intex'
import '../AddItemPage.css'

export function AddCategoriaPage() {

    return (
        <main className="Page">
            <div className="Page__content">
                <h1>Adicionar Categoria</h1>
                <AdicionarCategoriaForm />
            </div>
        </main>
    )
}