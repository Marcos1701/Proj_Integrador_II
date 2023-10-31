import axios from "axios";
import { ITransacao } from "../Transacao";
import { useEffect, useState } from "react";
import { api_url } from "../../Contexts/AuthContext";

export interface ICategoria {
    id: string;
    id_usuario: string;
    nome: string;
    descricao: string;
    icone?: string;
    tipo: string;
}

export interface IOrcamento {
    id: string;
    id_categoria: string;
    Limite: number;
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
    const [Orcamento, setOrcamento] = useState<IOrcamento | undefined>()

    useEffect(() => {
        const getTransacoes = async () => {
            const transacoes = await axios.get<ITransacao[]>(`${api_url}Transacao?id_categoria=${categoria.id}`).then(res => res.data).catch(err => {
                console.log(err)
                return []
            });
            setTransacoes(transacoes);
        }
        getTransacoes();

        const getOrcamento = async () => {
            const Orcamento = await axios.get<IOrcamento | undefined>(`${api_url}Orcamento?id_categoria=${categoria.id}`)
                .then(res => res.data)
                .catch(err => {
                    console.log(err)
                    return undefined
                });
            setOrcamento(Orcamento);
        }
        getOrcamento();
    }, [categoria.id])

    const valorGasto: number = transacoes.reduce((acc: number, transacao: ITransacao) => {
        if (transacao.tipo === 'Gasto') {
            return acc + transacao.Valor
        }
        return acc - transacao.Valor // Entrada
    }, 0)

    const valorOrcamento: number | undefined = Orcamento?.Limite

    return (
        <div className="categoria">
            {categoria.icone &&
                <div className="categoria-icon">
                    <img src={categoria.icone} alt={categoria.nome} />
                </div>
            }

            <div className="categoria-info">
                <h3>{categoria.nome}</h3>
            </div>

            <div className="categoria-valores">
                <p id="valorGasto">{valorGasto}</p>
                {valorOrcamento && <p id="valorOrcamento">{valorOrcamento}</p>}
            </div>
        </div>
    )
}