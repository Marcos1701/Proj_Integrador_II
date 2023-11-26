import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, Navigate } from "react-router-dom";
import { api_url, useAuth } from "../../../../Contexts/AuthContext";
import * as echarts from 'echarts';
import { ReactECharts } from "./components/Echarts";
import './CategoriasSection.css'

interface CategoriaData {
    id: string
    nome: string
    gasto: number
    qtdTransacoes: number
}

interface dataResponse {
    dados: CategoriaData[]
    totalGasto: number
}

export function SectionCategorias() {

    const { user } = useAuth()
    if (!user) return <Navigate to="/login" />
    const [categorias, setCategorias] = useState<CategoriaData[]>([])

    useEffect(() => {
        const getData = async () => {
            const response = await axios.get<dataResponse>(`${api_url}categorias/dados`, {
                headers: {
                    Authorization: user.access_token
                }

            })
            setCategorias(response.data.dados)
        }
        getData()
    }, [])

    const option: echarts.EChartsOption
        = {
        options: [],
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',

        },
        legend: {

            orient: 'vertical',
            left: 'left',
            data: categorias.map((categoria) => categoria.nome),
            textStyle: {
                color: 'white'
            },
            width: 100,
            height: 100
        },
        series: [
            {
                name: 'Transações por categoria',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: categorias.map((categoria) => {
                    return {
                        value: categoria.gasto,
                        name: categoria.nome
                    }
                })
                ,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    color: 'white'
                },
                labelLine: {
                    lineStyle: {
                        color: 'white'
                    }
                },
            }
        ]
    };

    return (
        <div className="Categorias-section-home">
            <div className="header">
                <h2>Dados Categorias</h2>
            </div>

            <div className="Relação de categorias">
                {
                    categorias.length > 0 ? <ReactECharts
                        option={option}
                        style={{ height: "150px", width: "250px" }}
                    />
                        : <h3>Não há categorias cadastradas</h3>
                }
            </div>

            <div className="footer">
                <NavLink to="/categorias" className="link">
                    ver todas as categorias <svg width="17" height="8" viewBox="0 0 17 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.3182 4.3182C16.4939 4.14246 16.4939 3.85754 16.3182 3.6818L13.4544 0.818019C13.2787 0.642283 12.9938 0.642283 12.818 0.818019C12.6423 0.993755 12.6423 1.27868 12.818 1.45441L15.3636 4L12.818 6.54559C12.6423 6.72132 12.6423 7.00625 12.818 7.18198C12.9938 7.35772 13.2787 7.35772 13.4544 7.18198L16.3182 4.3182ZM0 4.45L16 4.45V3.55L0 3.55L0 4.45Z" fill="white" />
                    </svg>
                </NavLink>
            </div>
        </div>
    )
}