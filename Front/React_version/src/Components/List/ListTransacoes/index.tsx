import { CategoriasContext } from "../../../Contexts/CategoriasContext";
import { TransacoesContext, TransacoesContextData } from "../../../Contexts/TransacoesContext";
import { ICategoria } from "../ListCategorias/Components/Categoria";
import { ITransacao } from "../ListTransacoesCard/Components/Transacao";
import { useContext } from "react";
import './ListTransacoes.css'
import { Box } from "./Components/box";
import { Link } from "react-router-dom";


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
            <div className="anchors_to_transacoesPage">
                <h2 className="title">Últimas transações</h2>
                <Link to={`/transacoes`} key={"linkToTransacoes"}>Ver todas</Link>
            </div>
            <div className="legend-transacoes">
                <div className="legend-item">Titulo</div>
                <div className="legend-item">Categoria</div>
                <div className="legend-item">Data</div>
                <div className="legend-item">Valor</div>
            </div>
            <ul className="listValues">
                {transacoes.length === 0 && <li className="empty" key={"empty"}>Nenhuma transação cadastrada</li>}
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
                                    return <li key={transacao.id + 'noCategory'}></li>
                                }

                                return (
                                    <li className="listItem" key={transacao.id}>
                                        <Box
                                            key={transacao.id + "box"}
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
/*
Warning: Each child in a list should have a unique "key" prop.

Check the render method of `ListTransacoes`. See https://reactjs.org/link/warning-keys for more information.
    at ListTransacoes (http://localhost:5173/src/Components/List/ListTransacoes/index.tsx?t=1700081298331:25:3)

esse warning é porque o react precisa de uma key para cada elemento da lista, para poder identificar cada elemento
para resolver isso, basta colocar uma key nos elementos da lista, como no exemplo abaixo:

*/