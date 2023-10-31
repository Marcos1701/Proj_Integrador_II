import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth, api_url } from "../Contexts/AuthContext"
import { CategoriasContext } from "../Contexts/CategoriasContext"
import { ICategoria } from "../Components/Categoria"


interface CategoriasProviderProps {
    children: React.ReactNode
}

export function CategoriasProvider({ children }: CategoriasProviderProps) {
    const [categorias, setCategorias] = useState<ICategoria[]>([])
    const { user } = useAuth();

    useEffect(() => {
        async function loadTransacoes() {
            if (!user) return
            const response = await axios.get(`${api_url}Categoria?id_usuario=${user.id}`)
            setCategorias(response.data)
        }
        loadTransacoes()
    }, [])

    return (
        <CategoriasContext.Provider value={categorias}>
            {children}
        </CategoriasContext.Provider>
    )
}