
import { AdicionarCategoriaForm } from '../../Form/AdicionarCategoriaForm/intex'
import '../AddItemPage.css'

export function AddCategoriaPage() {

    return (
        <main className="AddPage">
            <div className="AddPage__content">
                <h1>Adicionar Categoria</h1>
                <AdicionarCategoriaForm />
            </div>
        </main>
    )
}