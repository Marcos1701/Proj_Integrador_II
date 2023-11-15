import { useEffect, useState } from "react"

import axios from "axios"
import { useAuth, api_url } from "../Contexts/AuthContext"
import { TransacoesContext, TransacoesContextData } from "../Contexts/TransacoesContext"
import { ITransacao } from "../Components/List/ListTransacoesCard/Components/Transacao"


interface TransacoesProviderProps {
    children: React.ReactNode
}

export function TransacoesProvider({ children }: TransacoesProviderProps) {
    const [transacoes, setTransacoes] = useState<ITransacao[]>([])
    const [updated, setUpdated] = useState<boolean>(false)
    const { user } = useAuth();

    useEffect(() => {
        async function loadTransacoes() {
            if (!user) return
            const response = await axios.get<ITransacao[]>(`${api_url}transacoes`, {
                headers: {
                    getAuthorization: true,
                    Authorization: user.access_token,
                }
            })
            if (response.status === 401 || !response.data) {
                alert('Sessão expirada')
                return
            }

            setTransacoes(response.data.sort((a, b) => {
                const dateA = new Date(a.data)
                const dateB = new Date(b.data)
                return dateA > dateB ? -1 : dateA < dateB ? 1 : 0
            })
            ) // ordenar pela data
            setUpdated(false)
        }
        loadTransacoes()
    }, [updated, user])

    const value: TransacoesContextData = {
        transacoes,
        setUpdated,
        updated
    }

    return (
        <TransacoesContext.Provider value={value}>
            {children}
        </TransacoesContext.Provider>
    )
}