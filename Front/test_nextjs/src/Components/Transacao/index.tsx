import { ICategoria } from "../Categoria";

export interface ITransacao {
    id: string;
    id_categoria: string;
    id_usuario: string;
    name: string;
    tipo: "Gasto" | "Entrada";
    valor: number;
    data: string;
    descricao: string;
}

export interface ITransacaoProps {
    transacao: ITransacao;
    categoria: ICategoria;
}

export async function Transacao({ transacao, categoria }: ITransacaoProps) {

    return (
        <div className="transacao" id={transacao.id}>
            <div className="names">
                <p id="nome-transacao">{transacao.name}</p>
                <p id="nome-categoria">{categoria.nome}</p>
            </div>

            <div className="valores">
                <p id="valor-transacao">{transacao.valor}</p>
                <p id="data-transacao">{transacao.data}</p>
            </div>
        </div>
    )
}