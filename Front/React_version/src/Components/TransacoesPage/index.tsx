import { useState } from "react";
import { ListTransacoes } from "../ListTransacoes";
import { Navigate } from "react-router-dom";
import './TransacoesPage.css'

export function TransacoesPage() {
    // caso clicar no botão de voltar, redirecionar para a página inicial
    const [voltar, setVoltar] = useState<boolean>(false);

    return (
        <main>
            {voltar && <Navigate to={'/'} />}
            <div className="transacoes-header">
                <button onClick={() => { setVoltar(!voltar) }}
                    className="back-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none">
                        <g clip-path="url(#clip0_206_145)">
                            <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" fill="black" />
                        </g>
                        <defs>
                            <clipPath id="clip0_206_145">
                                <rect width="24" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>

                <h2 className="title">Transações</h2>
            </div>

            <ListTransacoes page={1} limit={6} />

        </main>
    )

}