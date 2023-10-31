import { ICategoria } from "../Categoria";
import './Transacao.css'

export interface ITransacao {
    id: string;
    id_categoria: string;
    id_usuario: string;
    nome: string;
    tipo: "Gasto" | "Entrada";
    Valor: number;
    Data: string;
    Descricao: string;
}

export interface ITransacaoProps {
    transacao: ITransacao;
    categoria: ICategoria;
}

export function Transacao({ transacao, categoria }: ITransacaoProps) {

    return (
        <div className="transacao" id={transacao.id}>
            <div className="line">
                <p id="nome-transacao">{transacao.nome}</p>
                <p id="valor-transacao">{transacao.Valor}</p>
            </div>

            <div className="line">
                <p id="nome-categoria">{categoria.nome}</p>
                <p id="data-transacao">{transacao.Data}</p>
            </div>
        </div>
    )
}