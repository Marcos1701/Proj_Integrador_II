import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth, api_url } from "../Contexts/AuthContext"
import { IMeta } from "../Components/List/ListMetas/Components/Meta"
import { MetasContext } from "../Contexts/MetasContext"
import { ulid } from "ulidx"


interface MetasProviderProps {
    children: React.ReactNode
}

export function MetasProvider({ children }: MetasProviderProps) {
    const [metas, setMetas] = useState<IMeta[]>([
        {
            id: ulid(),
            valor_Desejado: 1000,
            valor_Atual: 0,
            dataFinal: new Date('2023-12-10'),
            progresso: 0,
            titulo: 'Meta 1',
            icon: 'dollar-bill.svg'
        }, {
            id: ulid(),
            valor_Desejado: 1500,
            valor_Atual: 1000,
            dataFinal: new Date('2023-12-10'),
            progresso: 66, // % 
            titulo: 'Meta 2',
            icon: 'dollar-bill.svg'
        }, {// 50%
            id: ulid(),
            valor_Desejado: 1500,
            valor_Atual: 750,
            dataFinal: new Date('2023-12-10'),
            progresso: 50, // % 
            titulo: 'Meta 3',
            icon: 'credit_card.svg'
        }, {// 100%
            id: ulid(),
            valor_Desejado: 1500,
            valor_Atual: 1500,
            dataFinal: new Date('2023-12-10'),
            progresso: 100, // % 
            titulo: 'Meta 4',
            icon: 'car-vehicle.svg'
        }
    ])

    const { user } = useAuth();

    // useEffect(() => {
    //     async function loadMetas() {
    //         if (!user) return
    //         const response = await axios.get(`${api_url}Meta`, {
    //             headers: {
    //                 Authorization: `Bearer ${user.access_token}`
    //             }
    //         })
    //         setMetas(response.data)
    //     }
    //     loadMetas()
    // }, [])

    return (
        <MetasContext.Provider value={metas}>
            {children}
        </MetasContext.Provider>
    )
}