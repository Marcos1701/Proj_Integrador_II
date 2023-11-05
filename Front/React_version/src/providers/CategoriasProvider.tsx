import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth, api_url } from "../Contexts/AuthContext"
import { CategoriasContext, CategoriasOrderContext, CategoriasOrderContextData } from "../Contexts/CategoriasContext"
import { ICategoria } from "../Components/Categoria"


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

    const { user } = useAuth();

    useEffect(() => {
        async function loadCategorias() {
            if (!user) return

            const orderQuery = orders ? `&order=${JSON.stringify(orders)}` : ''
            const searchQuery = search ? `&search=${search}` : ''

            const CategoriasResponse = await axios.get<ICategoria[]>(`${api_url}categorias${orderQuery}${searchQuery}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`
                    }
                }
            )

            if (CategoriasResponse.status == 404) {
                console.log('Categorias not found')
                return
            }

            setCategorias(CategoriasResponse.data)
        }

        loadCategorias()
    }, [])

    const value: CategoriasOrderContextData = {
        order: { order: orders, setOrder: setOrders },
        search: { search, setSearch }
    }
    return (
        <CategoriasContext.Provider value={categorias}>
            <CategoriasOrderContext.Provider value={value}>
                {children}
            </CategoriasOrderContext.Provider>
        </CategoriasContext.Provider>
    )
}