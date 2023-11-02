import { Suspense, useContext } from "react";
import { IMeta, Meta } from "../Meta";
import { useAuth } from "../../Contexts/AuthContext";
import { MetasContext } from "../../Contexts/MetasContext";


export function ListMetas() {
    const { user } = useAuth();
    if (!user) return <p>Erro ao carregar metas</p>
    const metas: IMeta[] = useContext(MetasContext);

    return (
        <Suspense fallback={
            <div className="metas-home-skeleton">
            </div>
        }>

            <div className="lista-metas" key="lista-metas">
                <ul className="list-values-2columns">
                    {
                        metas.map(
                            (meta: IMeta) => <li key={meta.id}> <Meta meta={meta} key={meta.id} /></li>
                        )
                    }
                </ul>
            </div>
        </Suspense >
    )
}