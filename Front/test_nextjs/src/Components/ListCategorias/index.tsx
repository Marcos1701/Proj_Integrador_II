import { Categoria, ICategoria } from "@/Components/Categoria";
import { useUser } from "@/EncapsulatedContext";
import { Suspense } from "react";


export async function ListCategorias() {

    const user = await useUser();
    // const categorias = await fetch(`http://localhost:3000/Categoria`,
    //     {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ id_usuario: user!.id })
    //     }
    // ).then(res => res.json()).catch(err => {
    //     console.log(err)
    //     return []
    // })

    const categorias = await fetch(`http://localhost:3300/Categoria?id_usuario=${user!.id}`).then(res => res.json()).catch(err => {
        console.log(err)
        return []
    })

    return (
        <Suspense fallback={
            <div className="categorias-home-skeleton">
            </div>
        }>
            <div className="categorias-home">
                {
                    categorias.map(
                        (categoria: ICategoria) => <Categoria categoria={categoria} />
                    )
                }
            </div>
        </Suspense>
    )

}