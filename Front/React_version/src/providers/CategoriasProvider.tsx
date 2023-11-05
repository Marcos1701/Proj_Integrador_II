import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth, api_url } from "../Contexts/AuthContext"
import { CategoriasContext } from "../Contexts/CategoriasContext"
import { ICategoria, IOrcamento } from "../Components/Categoria"


interface CategoriasProviderProps {
    children: React.ReactNode
}

export function CategoriasProvider({ children }: CategoriasProviderProps) {
    const [categorias, setCategorias] = useState<ICategoria[]>([])
    const { user } = useAuth();

    useEffect(() => {
        async function loadCategorias() {
            if (!user) return
            const [CategoriasResponse, OrcamentosResponse] = await Promise.all([
                axios.get<ICategoria[]>(`${api_url}Categoria?id_usuario=${user.id}`),
                axios.get<IOrcamento[]>(`${api_url}Orcamento?id_usuario=${user.id}`)
            ])

            const categorias = CategoriasResponse.data.map((categoria: ICategoria) => {
                const orcamento = OrcamentosResponse.data.find((orcamento: IOrcamento) => {
                    return orcamento.id_categoria === categoria.id
                })
                if (!orcamento) return categoria
                return {
                    ...categoria,
                    orcamento
                }
            })

            setCategorias(categorias)
        }

        loadCategorias()
    }, [])

    return (
        <CategoriasContext.Provider value={categorias}>
            {children}
        </CategoriasContext.Provider>
    )
}