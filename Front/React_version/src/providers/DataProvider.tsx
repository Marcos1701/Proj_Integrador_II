import { useEffect, useState } from "react"
import { CategoriasDataResponse, CategoriasHistoryData, DataContext, DataContextData, MetasDataResponse, TransacoesDataResponse, TransacoesHistory } from "../Contexts/DataContext"
import axios from "axios"
import { api_url, useAuth } from "../Contexts/AuthContext"


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
    const [DadosTransacoesHistory, setDadosTransacoesHistory] = useState<TransacoesHistory>({
        history: []
    })
    const [DadosCategoriasHistory, setDadosCategoriasHistory] = useState<CategoriasHistoryData>({
        data: []
    })

    const [TransacoesHistoryYear, setTransacoesHistoryYear] = useState<number>(new Date().getFullYear())
    const [TransacoesHistoryMonth, setTransacoesHistoryMonth] = useState<number>(new Date().getMonth() + 1)
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
        // getDadosMetas()
    }, [updated, user])

    useEffect(() => {
        const getDadosTransacoesHistory = async () => {
            setLoading(true)
            const response = await axios.get<TransacoesHistory>(`${api_url}transacoes/historico`, {
                params: {
                    ano: TransacoesHistoryYear ? TransacoesHistoryYear : new Date().getFullYear(),
                    mes: TransacoesHistoryMonth ? TransacoesHistoryMonth : null
                },
                headers: {
                    Authorization: user.access_token
                }

            })
            setDadosTransacoesHistory(response.data)
            console.log(response.data)
            setLoading(false)
        }

        const getDadosCategoriasHistory = async () => {
            setLoading(true)
            const response = await axios.get<CategoriasHistoryData>(`${api_url}categorias/historico`, {
                headers: {
                    Authorization: user.access_token
                }
            })
            setDadosCategoriasHistory(response.data)
            setLoading(false)
        }

        getDadosTransacoesHistory()
        getDadosCategoriasHistory()

    }, [TransacoesHistoryYear, TransacoesHistoryMonth, user])

    const value: DataContextData = {
        DadosCategoria,
        DadosTransacao,
        DadosMeta,
        loading,
        setUpdated,
        DadosTransacoesHistory,
        DadosCategoriasHistory,
        setTransacoesHistoryYear,
        setTransacoesHistoryMonth
    }

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )

}