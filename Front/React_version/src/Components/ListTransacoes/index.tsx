import { CategoriasContext } from "../../Contexts/CategoriasContext";
import { TransacoesContext } from "../../Contexts/TransacoesContext";
import { ICategoria } from "../Categoria";
import { ITransacao, Transacao } from "../Transacao"
import { useContext, useState } from "react";
import './ListTransacoes.css'


interface IListTransacoesProps {
    page?: number;
    limit?: number;
    pagination?: boolean;
}

export function ListTransacoes({ page = 1, limit = 2, pagination = true }: IListTransacoesProps) {

    const transacoes: ITransacao[] = useContext(TransacoesContext)
    const categorias: ICategoria[] = useContext(CategoriasContext)
    const [pageAtual, setPageAtual] = useState<number>(page);

    return (
        <div className="list_transacoes" >
            <ul className="list-values-2columns" id="list-Transacoes">
                {
                    transacoes
                        .slice((pageAtual - 1) * limit, pageAtual * limit)
                        .map(
                            (transacao: ITransacao) => {
                                const categoria: ICategoria | undefined = categorias.find(
                                    (categoria: ICategoria) => {
                                        return categoria.id === transacao.categoriaid
                                    }
                                );

                                if (!categoria) {
                                    return <></>
                                }

                                return (
                                    <li key={"key" + transacao.id}>
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
        </div>
    )
}