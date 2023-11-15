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