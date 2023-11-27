import { useEffect, useState } from "react"
import { CategoriasDataResponse, DataContext, DataContextData, MetaData, MetasDataResponse, TransacoesDataResponse } from "../Contexts/DataContext"
import axios from "axios"
import { api_url, useAuth } from "../Contexts/AuthContext"
import { Navigate } from "react-router-dom"


interface DataProviderProps {
    children: React.ReactNode
}

export function DataProvider({ children }: DataProviderProps) {

    const { user } = useAuth()
    if (!user) return;

    const [DadosCategoria, setDadosCategoria] = useState<CategoriasDataResponse>({
        dados: [],
        totalGasto: 0
    })
    const [DadosTransacao, setDadosTransacao] = useState<TransacoesDataResponse>({
        dados: [],
        totalGasto: 0,
        totalEntrada: 0
    })
    const [DadosMeta, setDadosMeta] = useState<MetasDataResponse>({
        dados: []
    })
    const [loading, setLoading] = useState<boolean>(true)
    const [updated, setUpdated] = useState<boolean>(false)

    useEffect(() => {
        const getDadosCategorias = async () => {
            setLoading(true)
            const response = await axios.get<CategoriasDataResponse>(`${api_url}categorias/dados`, {
                headers: {
                    Authorization: user.access_token
                }

            })
            setDadosCategoria(response.data)
            setLoading(false)
        }

        const getDadosTransacoes = async () => {
            setLoading(true)
            const response = await axios.get<TransacoesDataResponse>(`${api_url}transacoes/dados`, {
                headers: {
                    Authorization: user.access_token
                }

            })
            setDadosTransacao(response.data)
            setLoading(false)
        }

        const getDadosMetas = async () => {
            setLoading(true)
            const response = await axios.get<MetasDataResponse>(`${api_url}metas/dados`, {
                headers: {
                    Authorization: user.access_token
                }

            })
            setDadosMeta(response.data)
            setLoading(false)
        }
        getDadosCategorias()
        getDadosTransacoes()
        getDadosMetas()
    }, [updated, user])

    const value: DataContextData = {
        DadosCategoria,
        DadosTransacao,
        DadosMeta,
        loading,
        setUpdated
    }

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )

}