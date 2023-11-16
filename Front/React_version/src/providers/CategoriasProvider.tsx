import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth, api_url } from "../Contexts/AuthContext"
import { CategoriasContext, CategoriasOrderContext, CategoriasOrderContextData } from "../Contexts/CategoriasContext"
import { ICategoria } from "../Components/List/ListCategorias/Components/Categoria"


interface CategoriasProviderProps {
    children: React.ReactNode
}

export enum ordenarCategorias {
    nome = "nome",
    datacriacao = "datacriacao",
    orcamento = "orcamento",
    gasto = "gasto"
}

export enum OrderElements {
    ASC = "ASC",
    DESC = "DESC"
}

export function CategoriasProvider({ children }: CategoriasProviderProps) {
    const [categorias, setCategorias] = useState<ICategoria[]>([])
    const [orderby, setOrderby] = useState<ordenarCategorias>(ordenarCategorias.datacriacao)
    const [order, setOrder] = useState<OrderElements>(OrderElements.ASC)
    const [search, setSearch] = useState<string>('')
    const [updated, setUpdated] = useState<boolean>(false)

    const { user } = useAuth();


    useEffect(() => {
        async function loadCategorias() {
            if (!user) return

            const CategoriasResponse = await axios.get<ICategoria[]>(`${api_url}categorias`
                , {
                    params: {
                        orderby: orderby == ordenarCategorias.datacriacao ? '' : orderby,
                        order: order == OrderElements.ASC ? '' : order,
                        search: search
                    },
                    headers: {
                        getAuthorization: true,
                        Authorization: user.access_token
                    }
                })

            if (CategoriasResponse.status == 404 || !CategoriasResponse.data) {
                console.log('Categorias not found')
                return
            }

            setCategorias(CategoriasResponse.data)
            setUpdated(false)
        }

        loadCategorias()

    }, [user, orderby, order, search, updated])

    const value: CategoriasOrderContextData = {
        order: { ordem: order, setOrdem: setOrder },
        orderby: { ordenarPor: orderby, setOrdenarPor: setOrderby },
        search: { search, setSearch },
        setUpdated: setUpdated
    }
    return (
        <CategoriasContext.Provider value={categorias}>
            <CategoriasOrderContext.Provider value={value}>
                {children}
            </CategoriasOrderContext.Provider>
        </CategoriasContext.Provider>
    )
}