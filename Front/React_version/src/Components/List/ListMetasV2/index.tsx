import { useContext } from "react"
import { IMetaContext, MetasContext } from "../../../Contexts/MetasContext"
import { Link } from "react-router-dom";
import { MetaBox } from "./Components/Meta";
import './ListaMetas.css'

interface IListaMetasProps {
    limit?: number
}

export function ListaMetas(
    {
        limit = 2,
    }: IListaMetasProps
): JSX.Element {

    const { metas }: IMetaContext = useContext(MetasContext);

    return (
        <div className="lista-metas">
            <div className="anchors_to_metasPage">
                <h2 className="title">Metas Recentes</h2>
                <Link to={`/metas`}>Ver todas</Link>
            </div>
            <div className="legend-metas">
                <div className="legend-item" id="titulo-transacao">Titulo</div>
                <div className="legend-item">Data Limite</div>
                <div className="legend-item">Valor Desejado</div>
                <div className="legend-item">Valor Obtido</div>
            </div>
            <ul className="listValues" id="lista_metas">
                {metas.length === 0 && <li className="empty" key='EmptyMetas'>Nenhuma meta cadastrada</li>}
                {
                    metas
                        .slice(0, limit)
                        .map(
                            (meta) => <li key={meta.id} className="li-meta"> <MetaBox meta={meta} key={meta.id} /></li>
                        )
                }
            </ul>
        </div>
    )
}