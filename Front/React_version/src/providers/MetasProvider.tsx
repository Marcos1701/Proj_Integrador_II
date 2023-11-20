import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth, api_url } from "../Contexts/AuthContext"
import { IMeta } from "../Components/List/ListMetas/Components/Meta"
import { IMetaContext, MetasContext } from "../Contexts/MetasContext"


interface MetasProviderProps {
    children: React.ReactNode
}

export function MetasProvider({ children }: MetasProviderProps) {
    const [metas, setMetas] = useState<IMeta[]>([])

    const { user } = useAuth();

    const [updated, setUpdated] = useState(false)

    useEffect(() => {
        async function loadMetas() {
            if (!user) return
            const response = await axios.get(`${api_url}meta`, {
                headers: {
                    Authorization: user.access_token
                }
            })
            if (response.status === 401) {
                alert('Sessão expirada')
                return
            }
            if (response.status !== 200) {
                alert('Erro ao carregar metas')
                return
            }
            response.data.forEach((meta: IMeta) => {
                meta.dataCriacao = new Date(meta.dataCriacao)
                meta.dataLimite = new Date(meta.dataLimite)
            })
            setMetas(response.data)
        }
        loadMetas()
        setUpdated(false)
    }, [updated, user])


    const value: IMetaContext = {
        metas,
        updated,
        setUpdated
    }

    return (
        <MetasContext.Provider value={value}>
            {children}
        </MetasContext.Provider>
    )
}