import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth, api_url } from "../Contexts/AuthContext"
import { IMeta } from "../Components/Meta"
import { MetasContext } from "../Contexts/MetasContext"


interface MetasProviderProps {
    children: React.ReactNode
}

export function MetasProvider({ children }: MetasProviderProps) {
    const [metas, setMetas] = useState<IMeta[]>([])
    const { user } = useAuth();

    useEffect(() => {
        async function loadTransacoes() {
            if (!user) return
            const response = await axios.get(`${api_url}Meta?id_usuario=${user.id}`)
            setMetas(response.data)
        }
        loadTransacoes()
    }, [])

    return (
        <MetasContext.Provider value={metas}>
            {children}
        </MetasContext.Provider>
    )
}