import { CategoriasContext } from "../../../Contexts/CategoriasContext";
import { TransacoesContext, TransacoesContextData } from "../../../Contexts/TransacoesContext";
import { ICategoria } from "../ListCategorias/Components/Categoria";
import { ITransacao, Transacao } from "../ListTransacoesCard/Components/Transacao";
import { useContext, useState } from "react";
import './ListTransacoes.css'
import { Box } from "./Components/box";


interface IListTransacoesProps {
    classname?: string;
}

export function ListTransacoes(
    {
        classname = "ListTransacoesSimple",
    }: IListTransacoesProps) {

    const { transacoes }: TransacoesContextData = useContext(TransacoesContext)
    const categorias: ICategoria[] = useContext(CategoriasContext)

    return (
        <div className={classname}>
            <h2>Últimas transações</h2>
            <ul className="listValues">
                <div className="legend">
                    <div className="legend-item">Titulo</div>
                    <div className="legend-item">Categoria</div>
                    <div className="legend-item">Data</div>
                    <div className="legend-item">Valor</div>
                </div>
                {transacoes.length === 0 && <li className="empty">Nenhuma transação cadastrada</li>}
                {
                    transacoes
                        .slice(0, 3)
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
                                    <li key={transacao.id}>
                                        <Box
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
    )
}