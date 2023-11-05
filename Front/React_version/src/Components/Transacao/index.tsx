import { ICategoria } from "../Categoria";
import './Transacao.css'

export interface ITransacao {
    id: string;
    id_categoria: string;
    id_usuario: string;
    nome: string;
    tipo: "Saida" | "Entrada";
    valor: number;
    data: string;
    descricao: string;
}

export interface ITransacaoProps {
    transacao: ITransacao;
    categoria: ICategoria;
}

export function Transacao({ transacao, categoria }: ITransacaoProps) {

    const tratarData = (data: string) => { // tratar para o estilo => 22 Setembro 2023
        const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
        const dataSplit = data.split('-')
        return `${dataSplit[2]} ${meses[parseInt(dataSplit[1]) - 1]} ${dataSplit[0]}`
    }

    return (
        <div className="transacao" id={transacao.id}>
            <div className="transacao-icon">
                <img src={
                    categoria.icone ?
                        categoria.icone :
                        "/assets/icons/Icon-barraquinha.svg"
                } alt={categoria.nome} />
            </div>
            <div className="transacao-info">
                <div className="line" id="line1">
                    <p id="nome-transacao">{transacao.nome}</p>
                    <p id="valor-transacao" className={transacao.tipo}>R$ {transacao.valor}</p>
                </div>

                <div className="line" id="line2">
                    <p id="nome-categoria">{categoria.nome}</p>
                    <p id="data-transacao">{tratarData(transacao.data)}</p>
                </div>
            </div>
        </div>
    )
}