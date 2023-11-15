import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth, api_url } from "../Contexts/AuthContext"
import { CategoriasContext, CategoriasOrderContext, CategoriasOrderContextData } from "../Contexts/CategoriasContext"
import { ICategoria } from "../Components/List/ListCategorias/Components/Categoria"



interface CategoriasProviderProps {
    children: React.ReactNode
}

export interface ordenarCategorias {
    nome?: 'ASC' | 'DESC';
    dataCriacao?: 'ASC' | 'DESC';
    orcamento?: 'ASC' | 'DESC';
}

export function CategoriasProvider({ children }: CategoriasProviderProps) {
    const [categorias, setCategorias] = useState<ICategoria[]>([])
    const [orders, setOrders] = useState<ordenarCategorias>({})
    const [search, setSearch] = useState<string>('')
    const [updated, setUpdated] = useState<boolean>(false)

    const { user } = useAuth();


    useEffect(() => {
        async function loadCategorias() {
            if (!user) return

            const orderQuery = orders ? Object.entries(orders).map(([key, val]) => `&order[${key}]=${val}`).join('&') : ''
            const searchQuery = search ? `&search=${search}` : ''

            const CategoriasResponse = await axios.get<ICategoria[]>(`${api_url}categorias${orderQuery.length > 0 || searchQuery.length > 0 ? '?' : ''}${orderQuery}${searchQuery}`
                , {
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

    }, [user, orders, search, updated])

    const value: CategoriasOrderContextData = {
        order: { order: orders, setOrder: setOrders },
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