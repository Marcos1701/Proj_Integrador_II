import { useAuth } from "@/Contexts/AuthContext";
import { ITransacao } from "../Transacao";

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

export async function Categoria({ categoria }: { categoria: ICategoria }) {

    const { user } = useAuth();
    // const { valorGasto, valorOrcamento }: { valorGasto: number, valorOrcamento?: number }
    //     = await fetch(`http://localhost:3000/Categoria/${categoria.id}/valores`,
    //         {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ id_usuario: user!.id })
    //         }
    //     ).then(res => res.json())

    const [transacoes, Orcamento]: [ITransacao[], IOrcamento | undefined] = await Promise.all([await fetch(`http://localhost:3000/Transacao?id_categoria=${categoria.id}`).then(res => res.json()).catch(err => {
        console.log(err)
        return []
    }) // usando o json-server
        , await fetch(`http://localhost:3000/Orcamento?id_categoria=${categoria.id}`).then(res => res.json()).catch(err => {
            console.log(err)
            return []
        }) // usando o json-server
    ])

    const valorGasto: number = transacoes.reduce((acc: number, transacao: ITransacao) => {
        if (transacao.tipo === 'Gasto') {
            return acc + transacao.valor
        }
        return acc - transacao.valor // Entrada
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
                {/* <p>{categoria.descricao}</p> */}
            </div>

            <div className="categoria-valores">
                <p id="valorGasto">{valorGasto}</p>
                {valorOrcamento && <p id="valorOrcamento">{valorOrcamento}</p>}
            </div>
        </div>
    )
}