import axios from "axios";
import { ITransacao } from "../Transacao";
import { useEffect, useState } from "react";
import { api_url } from "../../Contexts/AuthContext";
import './Categoria.css'

export interface ICategoria {
    id: string;
    nome: string;
    descricao: string;
    dataCriacao: Date;
    orcamento?: number;
    gasto: number;
    icone?: string;
}


export function Categoria({ categoria }: { categoria: ICategoria }) {

    // const { valorGasto, valorOrcamento }: { valorGasto: number, valorOrcamento?: number }
    //     = await fetch(`${api_url}Categoria/${categoria.id}/valores`,
    //         {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ id_usuario: user!.id })
    //         }
    //     ).then(res => res.json())


    const [transacoes, setTransacoes] = useState<ITransacao[]>([])

    useEffect(() => {
        const getTransacoes = async () => {
            const transacoes = await axios.get<ITransacao[]>(`${api_url}Transacao?id_categoria=${categoria.id}`).then(res => res.data).catch(err => {
                console.log(err)
                return []
            });
            setTransacoes(transacoes);
        }
        categoria.gasto === undefined && getTransacoes(); // Se o gasto já foi definido, não precisa buscar as transações
    }, [categoria.id])

    const valorGasto: number =
        categoria.gasto !== undefined ? categoria.gasto :
            transacoes.reduce((acc: number, transacao: ITransacao) => {
                if (transacao.tipo === 'Saida') {
                    return acc + transacao.valor
                }
                return acc - transacao.valor // Entrada
            }, 0)

    const valorOrcamento: number | undefined = categoria.orcamento ? categoria.orcamento : undefined

    return (
        <div className="categoria" id={categoria.id}>
            <div className="categoria-icon">
                <img src={categoria.icone ? categoria.icone : "/assets/icons/Icon-barraquinha.svg"} alt={categoria.nome} />
            </div>

            <div className="categoria-info">
                <h3>{categoria.nome}</h3>
            </div>

            <div className="categoria-valores">
                <p id="valorGasto">{valorGasto < 0 ? `R$ 0` : `R$ ${valorGasto}`
                }</p>
                {valorOrcamento != undefined && <p id="valorOrcamento">{valorOrcamento}</p>}
            </div>
        </div>
    )
}