import { useEffect, useState } from "react"
import { CategoriasDataResponse, CategoriasHistory, DataContext, DataContextData, MetasDataResponse, TransacoesDataResponse, TransacoesHistory } from "../Contexts/DataContext"
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
    const [DadosMeta] = useState<MetasDataResponse>({
        dados: []
    })
    const [DadosTransacoesHistory, setDadosTransacoesHistory] = useState<TransacoesHistory>({
        history: []
    })
    const [DadosCategoriasHistory, setDadosCategoriasHistory] = useState<CategoriasHistory | null>(null)

    const [TransacoesHistoryYear, setTransacoesHistoryYear] = useState<number>(new Date().getFullYear())
    const [TransacoesHistoryMonth, setTransacoesHistoryMonth] = useState<number>(new Date().getMonth() + 1)
    const [loading, setLoading] = useState<boolean>(true)
    const [updated, setUpdated] = useState<boolean>(false)

    useEffect(() => {
        const getAllData = async () => {
            setLoading(true)
            const [responseCategorias, responseTransacoes] = await Promise.all([
                axios.get<CategoriasDataResponse>(`${api_url}categorias/dados`, {
                    headers: {
                        Authorization: user.access_token
                    }
                }),
                axios.get<TransacoesDataResponse>(`${api_url}transacoes/dados`, {
                    headers: {
                        Authorization: user.access_token
                    }
                })
            ]).catch(err => {
                console.log(err)
                return [null, null]
            })

            if (!responseCategorias || !responseTransacoes) return

            setDadosCategoria(responseCategorias.data)
            setDadosTransacao(responseTransacoes.data)
            setLoading(false)
        }

        // const getDadosMetas = async () => {
        //     setLoading(true)
        //     const response = await axios.get<MetasDataResponse>(`${api_url}metas/dados`, {
        //         headers: {
        //             Authorization: user.access_token
        //         }

        //     })
        //     setDadosMeta(response.data)
        //     setLoading(false)
        // }

        // getDadosMetas()
        getAllData()
    }, [updated, user])

    useEffect(() => {

        const getAllData = async () => {
            setLoading(true)
            const [responseCategorias, responseTransacoes] = await Promise.all([
                axios.get<CategoriasHistory>(`${api_url}categorias/historico`, {
                    headers: {
                        Authorization: user.access_token
                    }
                }),
                axios.get<TransacoesHistory>(`${api_url}transacoes/historico`, {
                    headers: {
                        Authorization: user.access_token
                    }
                })
            ]).catch(err => {
                console.log(err)
                return [null, null]
            })

            if (!responseCategorias || !responseTransacoes) return

            setDadosCategoriasHistory(responseCategorias.data)
            setDadosTransacoesHistory(responseTransacoes.data)
            setLoading(false)
        }

        getAllData()

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