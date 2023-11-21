import { useEffect, useState } from "react"

import axios from "axios"
import { useAuth, api_url } from "../Contexts/AuthContext"
import { TransacoesContext, TransacoesContextData, ordenarTransacoes } from "../Contexts/TransacoesContext"
import { ITransacao } from "../Components/List/ListTransacoesCard/Components/Transacao"
import { OrderElements } from "./CategoriasProvider"


interface TransacoesProviderProps {
    children: React.ReactNode
}

export function TransacoesProvider({ children }: TransacoesProviderProps) {
    const [transacoes, setTransacoes] = useState<ITransacao[]>([])
    const [updated, setUpdated] = useState<boolean>(false)
    const [ordenarPor, setOrdenarPor] = useState<ordenarTransacoes>(ordenarTransacoes.data)
    const [ordem, setOrdem] = useState<OrderElements>(OrderElements.DESC)
    const [search, setSearch] = useState<string>('')
    const { user } = useAuth();

    useEffect(() => {
        async function loadTransacoes() {
            if (!user) return
            const response = await axios.get<ITransacao[]>(`${api_url}transacoes`, {
                params: {
                    orderby: ordenarPor,
                    order: ordem,
                    search: search
                },
                headers: {
                    getAuthorization: true,
                    Authorization: user.access_token,
                }
            })
            if (response.status === 401 || !response.data) {
                alert('Sessão expirada')
                return
            }
            setTransacoes(response.data)
            setUpdated(false)
        }
        loadTransacoes()
    }, [updated, user, ordem, ordenarPor, search])

    const value: TransacoesContextData = {
        transacoes,
        setUpdated,
        updated,
        ordem,
        setOrdem,
        ordenarPor,
        setOrdenarPor,
        search,
        setSearch
    }

    return (
        <TransacoesContext.Provider value={value}>
            {children}
        </TransacoesContext.Provider>
    )
}