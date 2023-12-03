import { useEffect, useState } from "react"

import axios from "axios"
import { useAuth, api_url } from "../Contexts/AuthContext"
import { TransacoesContext, TransacoesContextData, SortFieldTransacao } from "../Contexts/TransacoesContext"
import { ITransacao } from "../Components/List/ListTransacoesCard/Components/Transacao"
import { OrderElements } from "./CategoriasProvider"
import { Navigate } from "react-router-dom"


interface TransacoesProviderProps {
    children: React.ReactNode
}

export function TransacoesProvider({ children }: TransacoesProviderProps) {
    const [transacoes, setTransacoes] = useState<ITransacao[]>([])
    const [updated, setUpdated] = useState<boolean>(false)
    const [ordenarPor, setOrdenarPor] = useState<SortFieldTransacao>(SortFieldTransacao.DATA)
    const [ordem, setOrdem] = useState<OrderElements>(OrderElements.DESC)
    const [pagina, setPagina] = useState<number>(1)
    const [limite, setLimite] = useState<number>(3)
    const [search, setSearch] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true)
    const { user } = useAuth();

    useEffect(() => {
        async function loadTransacoes() {
            if (!user) return
            setLoading(true)
            const response = await axios.get<ITransacao[]>(`${api_url}transacoes`, {
                params: {
                    sortField: ordenarPor,
                    sortOrder: ordem,
                    search: search,
                    page: pagina,
                    limit: limite
                },
                headers: {
                    getAuthorization: true,
                    Authorization: user.access_token,
                }
            })

            if (response.status === 401 || !response.data) {
                setLoading(false)
                alert('Sessão expirada')
                return <Navigate to={'/login'} />
            }

            setTransacoes(response.data)
            console.log(response.data)
            setUpdated(false)
            setLoading(false)
        }
        loadTransacoes()
    }, [updated, user, ordem, ordenarPor, search, pagina, limite])

    const value: TransacoesContextData = {
        transacoes,
        setUpdated,
        updated,
        ordem,
        setOrdem,
        ordenarPor,
        setOrdenarPor,
        search,
        setSearch,
        loading,
        pagina,
        setPagina,
        limite,
        setLimite
    }

    return (
        <TransacoesContext.Provider value={value}>
            {children}
        </TransacoesContext.Provider>
    )
}