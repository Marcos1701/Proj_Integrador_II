import { useState } from "react";
import { ICategoria } from "../../../ListCategorias/Components/Categoria";
import { realizarTratamentoValor } from '../../../../Home/Components/SecaoAcoes/Components/Saldo';
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
    format?: 'list' | 'card';
}

export const tratarData = (data: string, format: 'completo' | 'simplificado' = "completo") => {
    // tratar para o estilo => 22 Setembro 2023 ou para o estilo => 22 Dez 2023
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    const dataSplit = data.toString().split('-')
    const dia = dataSplit[2].split('T')[0]
    const mes = meses[parseInt(dataSplit[1]) - 1]
    const ano = dataSplit[0]
    return `${dia} ${format == 'completo' ?
        mes :
        mes.slice(0, 3) // pegar apenas as 3 primeiras letras do mês
        } ${ano}`
}


export function Transacao({ transacao, categoria, format = 'card' }: ITransacaoProps) {

    const [showDetails, setShowDetails] = useState(false);

    return (
        <>
            {format === 'card' && (
                <a className="transacao-card" onClick={() => setShowDetails(!showDetails)}>
                    {showDetails && (<Navigate to={`/transacoes/${transacao.id}`} />)}
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
            )}
            {format === 'list' && (
                <a className="transacao-item" onClick={
                    () => {
                        setShowDetails(!showDetails);
                    }
                }>
                    {showDetails && <Navigate to={`/transacoes/${transacao.id}`} />}
                    <div className="icon-name-transacao">
                        <img src={
                            categoria.icone ?
                                `/assets/icons/${categoria.icone}.svg` :
                                "/assets/icons/barraquinha.svg"
                        } alt={categoria.nome} className='list-icon' />
                        <p className="nome-transacao">{transacao.titulo}</p>

                    </div>

                    <div className="name-categoria">
                        <p className="nome-categoria">{categoria.nome}</p>
                    </div>

                    <div className="Data_Transação">
                        <span className="data-transacao">{tratarData(transacao.data.toString(), 'simplificado')}</span>
                    </div>

                    <div className="valor-transacao">
                        <p className="valor">R$ {realizarTratamentoValor(transacao.valor)}</p>
                    </div>
                </a>
            )}
        </>
    );
}