import { IMeta, Meta } from "@/Components/Meta";
import { useAuth } from "@/Contexts/AuthContext";
import { Suspense } from "react";


export async function ListMetas() {
    const { user } = useAuth();
    const metas: IMeta[] = await fetch(`http://localhost:3000/Meta?id_usuario=${user!.id}`).then(res => res.json()).catch(err => {
        console.log(err)
        return []
    })

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