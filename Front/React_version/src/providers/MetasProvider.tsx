import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth, api_url } from "../Contexts/AuthContext"
import { IMeta } from "../Components/List/ListMetasV2/Components/Meta"
import { IMetaContext, MetasContext, ordenarMetas } from "../Contexts/MetasContext"
import { OrderElements } from "./CategoriasProvider"


interface MetasProviderProps {
    children: React.ReactNode
}

export function MetasProvider({ children }: MetasProviderProps) {
    const [metas, setMetas] = useState<IMeta[]>([])

    const [updated, setUpdated] = useState(false)
    const [ordenarPor, setOrdenarPor] = useState<ordenarMetas>(ordenarMetas.dataCriacao)
    const [ordem, setOrdem] = useState<OrderElements>(OrderElements.DESC)
    const [search, setSearch] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true)
    const { user } = useAuth();

    useEffect(() => {
        async function loadMetas() {
            if (!user) return
            setLoading(true)
            const response = await axios.get<IMeta[]>(`${api_url}meta`, {
                params: {
                    orderby: ordenarPor,
                    order: ordem,
                    search: search
                },
                headers: {
                    Authorization: user.access_token
                }
            })
            if (response.status === 401) {
                alert('Sessão expirada')
                return
            }
            if (response.status !== 200) {
                setLoading(false)
                alert('Erro ao carregar metas')
                return
            }
            response.data.forEach((meta: IMeta) => {
                meta.dataCriacao = new Date(meta.dataCriacao)
                meta.dataLimite = new Date(meta.dataLimite)
            })

            setMetas(response.data)
            setUpdated(false)
            setLoading(false)
        }
        loadMetas()
        setUpdated(false)
    }, [updated, user, ordem, ordenarPor, search])


    const value: IMetaContext = {
        metas,
        updated,
        setUpdated,
        ordem,
        setOrdem,
        ordenarPor,
        setOrdenarPor,
        search,
        setSearch,
        loading
    }

    return (
        <MetasContext.Provider value={value}>
            {children}
        </MetasContext.Provider>
    )
}