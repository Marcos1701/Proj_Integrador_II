import { Categoria, ICategoria } from "../Categoria";
import { useContext } from "react";
import { CategoriasContext } from "../../Contexts/CategoriasContext";


export function ListCategorias() {
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

    console.log(categorias)

    return (
        <>
            <div className="lista-categorias">
                <ul className="list-values-2columns">
                    {
                        categorias.map(
                            (categoria: ICategoria) => <li key={categoria.id}><Categoria categoria={categoria} key={categoria.id} /> </li>
                        )
                    }
                </ul>
            </div>
        </>
    )

}