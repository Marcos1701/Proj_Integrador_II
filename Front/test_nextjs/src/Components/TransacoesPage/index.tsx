import { useAuth } from "@/Contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { Button } from "../Button";
import { ListTransacoes } from "../ListTransacoes";

export async function TransacoesPage() {

    const [page, setPage] = useState(1);
    const pageRef = useRef<HTMLDivElement>(null);

    return (
        <main>
            <div className="transacoes-header">
                <Button onClick={() => window.location.href = "/"} >
                    <img src="/icons/arrow-left.svg" alt="Voltar" />
                </Button>

                <h2>Transações</h2>
            </div>

            <ListTransacoes page={page} limit={10} />

            <div className="pagination">
                <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
                    <img src="/icons/arrow-left.svg" alt="Voltar" />
                </Button>

                <div className="pagination-page" ref={pageRef}>
                    {page}
                </div>

                <Button onClick={() => setPage(page + 1)} disabled={pageRef.current?.offsetWidth === 0}>
                    <img src="/icons/arrow-right.svg" alt="Avançar" />
                </Button>
            </div>


        </main>
    )

}