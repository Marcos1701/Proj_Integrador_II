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

            <div className="metas-home">
                {
                    metas.map(
                        (meta: IMeta) => <Meta meta={meta} />
                    )
                }
            </div>
        </Suspense>
    )
}