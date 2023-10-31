import { Suspense } from "react";
import { IMeta, Meta } from "../Meta";
import { useUser } from "@/EncapsulatedContext";


export async function ListMetas() {
    const user = await useUser();
    const metas: IMeta[] = await fetch(`http://localhost:3300/Meta?id_usuario=${user.id}`).then(res => res.json()).catch(err => {
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