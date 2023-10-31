import { Categoria, ICategoria } from "../Categoria";
import { Suspense, useContext, useEffect, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { CategoriasContext } from "../../Contexts/CategoriasContext";


export function ListCategorias() {

    const { user } = useAuth();
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

    const categorias: ICategoria[] = useContext<ICategoria[]>(CategoriasContext);

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