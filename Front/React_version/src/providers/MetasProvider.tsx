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
        async function loadMetas() {
            if (!user) return
            const response = await axios.get(`${api_url}Meta`, {
                headers: {
                    Authorization: `Bearer ${user.access_token}`
                }
            })
            setMetas(response.data)
        }
        loadMetas()
    }, [])

    return (
        <MetasContext.Provider value={metas}>
            {children}
        </MetasContext.Provider>
    )
}