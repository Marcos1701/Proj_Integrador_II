import { useState } from "react";
import { ICategoria } from "../Categoria";
import { realizarTratamentoValor } from "../Home/Components/SecaoAcoes/Components/Saldo";
import './Transacao.css'
import { Navigate } from "react-router-dom";

export interface ITransacao {
    id: string;
    tipo: 'entrada' | 'saida';
    valor: number;
    titulo: string;
    descricao?: string;
    data: Date;
    categoriaid: string;
}

export interface ITransacaoProps {
    transacao: ITransacao;
    categoria: ICategoria;
}

export const tratarData = (data: string) => { // tratar para o estilo => 22 Setembro 2023
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    const dataSplit = data.toString().split('-')
    const dia = dataSplit[2].split('T')[0]
    const mes = meses[parseInt(dataSplit[1]) - 1]
    const ano = dataSplit[0]
    return `${dia} ${mes} ${ano}`
}
export function Transacao({ transacao, categoria }: ITransacaoProps) {

    const [showDetails, setShowDetails] = useState(false)

    return (
        <a className="transacao" id={transacao.id} onClick={() => setShowDetails(true)}>
            {showDetails &&
                <Navigate to={`/transacoes/${transacao.id}`} />
            }
            <div className="transacao-icon">
                <img src={
                    categoria.icone ?
                        `/assets/icons/${categoria.icone}.svg` :
                        "/assets/icons/barraquinha.svg"
                } alt={categoria.nome} className='icon' />
            </div>
            <div className="transacao-info">
                <p className="nome-transacao">{transacao.titulo}</p>
                <p className={"valor-transacao-" + transacao.tipo}>R$ {realizarTratamentoValor(transacao.valor)}</p>
            </div>
        </a>
    )
}