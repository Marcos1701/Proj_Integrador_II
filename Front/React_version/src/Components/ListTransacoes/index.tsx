import { CategoriasContext } from "../../Contexts/CategoriasContext";
import { TransacoesContext } from "../../Contexts/TransacoesContext";
import { ICategoria } from "../Categoria";
import { ITransacao, Transacao } from "../Transacao"
import { Suspense, useContext, useState } from "react";


interface IListTransacoesProps {
    page?: number;
    limit?: number;
    pagination?: boolean;
}

export function ListTransacoes({ page = 1, limit = 10, pagination = true }: IListTransacoesProps) {

    const transacoes: ITransacao[] = useContext(TransacoesContext)
    const categorias: ICategoria[] = useContext(CategoriasContext)
    const [pageAtual, setPageAtual] = useState<number>(page);

    return (
        <Suspense fallback={
            <div className="transacoes-home-skeleton">
            </div>
        }>
            <div className="list_transacoes">
                <ul id="list-Transacoes">
                    {
                        transacoes
                            .slice((pageAtual - 1) * limit, pageAtual * limit)
                            .map(
                                (transacao: ITransacao) => {
                                    const categoria: ICategoria | undefined = categorias.find(
                                        (categoria: ICategoria) => {
                                            return categoria.id === transacao.id_categoria
                                        }
                                    );

                                    if (!categoria) {
                                        return <></>
                                    }

                                    return (
                                        <li>
                                            <Transacao
                                                transacao={transacao}
                                                categoria={categoria}
                                            />
                                        </li>
                                    )
                                }
                            )
                    }
                </ul>
            </div>

            {pagination && <div className="pagination">
                <button onClick={() => {
                    if (pageAtual > 1) {
                        setPageAtual(pageAtual - 1);
                    }
                }}>Anterior</button>
                <button>{pageAtual}</button>
                {pageAtual < Math.ceil(transacoes.length / limit) && <button>{pageAtual + 1}</button>}
                {pageAtual + 1 < Math.ceil(transacoes.length / limit) && <button>{pageAtual + 2}</button>}
                <p className="dots">...</p>
                {pageAtual < Math.ceil(transacoes.length / limit) && <button>{Math.ceil(transacoes.length / limit)}</button>}
                <button onClick={() => {
                    if (pageAtual < Math.ceil(transacoes.length / limit)) {
                        setPageAtual(pageAtual + 1);
                    }
                }}>Próximo</button>
            </div>
            }
        </Suspense>
    )
}