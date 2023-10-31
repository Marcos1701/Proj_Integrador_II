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
            const response = await axios.get(`${api_url}Transacao?id_usuario=${user.id}`)
            setTransacoes(response.data)
        }
        loadTransacoes()
    }, [])

    return (
        <TransacoesContext.Provider value={transacoes}>
            {children}
        </TransacoesContext.Provider>
    )
}