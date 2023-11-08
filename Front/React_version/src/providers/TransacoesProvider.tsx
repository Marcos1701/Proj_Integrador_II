import { useEffect, useState } from "react"
import { ITransacao } from "../Components/Transacao"
import axios from "axios"
import { useAuth, api_url } from "../Contexts/AuthContext"
import { TransacoesContext } from "../Contexts/TransacoesContext"


interface TransacoesProviderProps {
    children: React.ReactNode
}

export function TransacoesProvider({ children }: TransacoesProviderProps) {
    const [transacoes, setTransacoes] = useState<ITransacao[]>([])
    const { user } = useAuth();

    useEffect(() => {
        async function loadTransacoes() {
            if (!user) return
            const response = await axios.get<ITransacao[]>(`${api_url}transacoes`, {
                headers: {
                    Authorization: user.access_token
                }
            })
            if (response.status === 401 || !response.data) {
                alert('Sessão expirada')
                return
            }
            console.log(response.data)
            setTransacoes(response.data.sort((a, b) => {
                const dateA = new Date(a.data)
                const dateB = new Date(b.data)
                return dateA > dateB ? -1 : dateA < dateB ? 1 : 0
            })
            ) // ordenar pela data
        }
        loadTransacoes()
    }, [])

    return (
        <TransacoesContext.Provider value={transacoes}>
            {children}
        </TransacoesContext.Provider>
    )
}