import { Button } from "../Button";
import { ListTransacoes } from "../ListTransacoes";

export function TransacoesPage() {

    return (
        <main>
            <div className="transacoes-header">
                <Button onClick={() => window.location.href = "/"} >
                    <img src="/icons/arrow-left.svg" alt="Voltar" />
                </Button>

                <h2>Transações</h2>
            </div>

            <ListTransacoes page={1} limit={10} />

        </main>
    )

}